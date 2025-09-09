import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'https://my-elasticsearch-project-f3794d.es.us-central1.gcp.elastic.cloud:443',
  auth: {
    apiKey: 'WmcwRUxKa0Jrb1d4dzJmVEtoY2Y6MUM0SXJaWTFaWnV5X0d6U3B1WmlZZw=='
  },
  serverMode: 'serverless',
});

const index = 'search-abcd';
const mapping = {
  "text": {
    "type": "semantic_text"
  }
};

const updateMappingResponse = await client.indices.putMapping({
  index,
  properties: mapping,
});
console.log(updateMappingResponse);