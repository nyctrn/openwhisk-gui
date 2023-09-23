import NodejsIcon from "../../../public/nodejs-logo.svg";
import PythonIcon from "../../../public/python-logo.svg";
import GoIcon from "../../../public/go-logo.svg";
import RubyIcon from "../../../public/ruby-logo.svg";
import JavaIcon from "../../../public/java-logo.svg";
import PhpIcon from "../../../public/php-logo.svg";
import SwiftIcon from "../../../public/swift-logo.svg";
import RustIcon from "../../../public/rust-logo.svg";
import DockerIcon from "../../../public/docker-logo.svg";
import SequenceIcon from "../../../public/sequence-icon.svg";
import Image from "next/image";
import { Exec } from "openwhisk";
import { Box, BoxProps, Tooltip } from "@mui/material";

const kinds = [
  { type: "nodejs", icon: NodejsIcon, width: 45 },
  { type: "python", icon: PythonIcon, width: 40 },
  { type: "go", icon: GoIcon, width: 60 },
  { type: "ruby", icon: RubyIcon, width: 35 },
  { type: "java", icon: JavaIcon, width: 35 },
  { type: "php", icon: PhpIcon, width: 60 },
  { type: "swift", icon: SwiftIcon, width: 45 },
  { type: "rust", icon: RustIcon, width: 45 },
  { type: "blackbox", icon: DockerIcon, width: 55 },
  { type: "sequence", icon: SequenceIcon, width: 80 },
];

const ActionKindIcon = ({
  execValue,
  ...boxProps
}: { execValue: Exec["kind"] } & BoxProps) => {
  const filteredKind = kinds
    .filter((kind) => execValue?.includes(kind.type))
    .map((kind) => (
      <Tooltip key={kind.type} title={execValue} placement="right">
        <Image
          src={kind.icon}
          alt={`${kind.type} icon`}
          width={kind.width}
          loading="eager"
          style={{ position: "relative", top: "7px" }}
        />
      </Tooltip>
    ));

  return (
    <Box {...boxProps}> {filteredKind.length ? filteredKind : execValue}</Box>
  );
};

export default ActionKindIcon;
