/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Workflow {
  schemaVersion?: string;
  name: string;
  processes?: {
    [k: string]: ProcessConfig;
  };
  environments?: {
    [k: string]: Environment;
  };
  [k: string]: unknown;
}
export interface ProcessConfig {
  repository?: string | null;
  revision?: string | null;
  path: string;
  inputs?: {
    [k: string]: string;
  };
  outputs?: {
    [k: string]: string;
  };
  env?: {
    [k: string]: unknown;
  };
  args?: string[];
  environment?: string | null;
}
export interface Environment {
  name: string;
  baseDir: string;
  dataMappings?: {
    [k: string]: string;
  };
}