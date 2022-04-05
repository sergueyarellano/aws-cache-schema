aws-cache-schema
===

AWS cache for glue schema registry.

aws-cache-schema will check if the definition of the schema is cached and will get it and cache it for you if not present

```js
import cacheSchema from '@sergueyarellano/aws-cache-schema'

// initialize the cache
const cache = cacheSchema('default-registry', 'us-west-2')

// lambda function
export const handler = async event => { 
  const SCHEMA_NAME = 'userSchema'
  const VERSION = 1

  const schemaDefinition = await cache.getSchema(SCHEMA_NAME, version)
}
```


you need `aws-sdk` as a dependency for this package to work