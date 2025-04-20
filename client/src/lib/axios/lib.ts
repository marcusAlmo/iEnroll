import axios from "axios";

interface Config {
  baseUrl?: string;
  headers: NonNullable<Parameters<typeof axios.create>[0]>["headers"];
}

export const createConfig = (config: Config) => config;
