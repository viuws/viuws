/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type Cardinality = "single" | "multiple";

export interface Process {
  schemaVersion?: string;
  name: string;
  description: string;
  container: OCIRuntimeConfig;
  inputChannels?: {
    [k: string]: InputChannel;
  };
  outputChannels?: {
    [k: string]: OutputChannel;
  };
  envJSONSchema?: string | null;
  envUISchema?: string | null;
  argsJSONSchema?: string | null;
  argsUISchema?: string | null;
}
export interface OCIRuntimeConfig {
  image: string;
  tag?: string;
  cwd?: string | null;
  env?: {
    [k: string]: unknown;
  };
  args: string[];
}
export interface InputChannel {
  name: string;
  description: string;
  cardinality?: Cardinality & string;
  required?: boolean;
  supportedFilePatterns?: string[] | null;
}
export interface OutputChannel {
  name: string;
  description: string;
  cardinality?: Cardinality & string;
  generatedFilePattern?: string | null;
}
