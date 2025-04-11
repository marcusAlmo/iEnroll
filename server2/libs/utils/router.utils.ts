import { Type } from '@nestjs/common';
import { Routes } from '@nestjs/core';

export const mapModulesToBasePath = (
  basePath: string,
  modules: Type<any>[],
): Routes => {
  return modules.map((mod) => ({
    path: basePath,
    module: mod,
  }));
};
