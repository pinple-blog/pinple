import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './sanity/schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'j5n3np2a'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'my-blog-studio',
  title: 'My Blog Studio',
  
  projectId,
  dataset,
  
  plugins: [
    deskTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
})



