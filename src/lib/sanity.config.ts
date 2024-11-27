import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { schemaTypes } from './schemas';

export const config = defineConfig({
  projectId: 'your-project-id',
  dataset: 'production',
  title: "Joy's Hypnose Admin",
  apiVersion: '2023-11-24',
  basePath: '/admin',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
}); 