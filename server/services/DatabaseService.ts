import Nano, { DocumentGetResponse } from "nano";

type SubjectNamespace = {
  name: string;
  uuid: string;
  key: string;
};

export type OpenWhiskSubject = DocumentGetResponse & {
  subject: string;
  namespaces: SubjectNamespace[];
};

export type OpenWhiskLimits = DocumentGetResponse & {
  concurrentInvocations: number;
  invocationsPerMinute: number;
  firesPerMinute: number;
  allowedKinds: string[];
  storeActivations: boolean;
};

export const nano = (db?: string) =>
  Nano(
    `http://${process.env.OPENWHISK_COUCHDB_USERNAME}:${process.env.OPENWHISK_COUCHDB_PASSWORD}@${process.env.OPENWHISK_COUCHDB_ADDRESS}`
  ).db.use(db || process.env.OPENWHISK_SUBJECTS_DB || "whisk_local_subjects");

async function getDocument<T>(
  docId: string
): Promise<{ data?: T; error?: Nano.RequestError }> {
  try {
    const document = await nano().get(docId);

    return { data: { ...document } as T };
  } catch (err) {
    const error = err as Nano.RequestError;
    console.log(error);

    return { error };
  }
}

async function insertDocument(doc: any) {
  try {
    const res = await nano().insert(doc);

    return res;
  } catch (err) {
    console.log(err);

    return Promise.reject(err);
  }
}

async function deleteDocument(docId: string) {
  try {
    const { data, error } = await getDocument<
      OpenWhiskLimits | OpenWhiskSubject
    >(docId);

    if (error) return Promise.reject(error);

    const databaseResponse = await nano().destroy(docId, data?._rev!!);

    return { response: databaseResponse };
  } catch (err) {
    console.log(err);

    return Promise.reject(err);
  }
}

async function fetcActivations(namespace: any) {
  try {
    const res = await nano("whisk_local_activations").list({
      startkey: `${namespace}/`,
      endkey: `${namespace}/\ufff0`,
      include_docs: true,
      inclusive_end: true,
    });

    return res;
  } catch (err) {
    console.log(err);

    return Promise.reject(err);
  }
}

const DatabaseService = {
  getDocument,
  insertDocument,
  fetcActivations,
  deleteDocument,
};

export default DatabaseService;
