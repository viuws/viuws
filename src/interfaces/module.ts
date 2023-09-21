/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export type IOCardinality = "single" | "multiple";

export interface Module {
    schemaVersion?: string;
    name: string;
    description: string;
    container: OCIRuntimeConfig;
    inputs?: {
        [k: string]: InputSpec;
    };
    outputs?: {
        [k: string]: OutputSpec;
    };
    envSchema?: string | null;
    envUISchema?: string | null;
    argsSchema?: string | null;
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
export interface InputSpec {
    name: string;
    description: string;
    cardinality?: IOCardinality & string;
    required?: boolean;
    supportedFilePatterns?: string[] | null;
}
export interface OutputSpec {
    name: string;
    description: string;
    cardinality?: IOCardinality & string;
    generatedFilePattern?: string | null;
}