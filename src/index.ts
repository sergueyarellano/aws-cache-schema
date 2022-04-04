import * as AWS from 'aws-sdk'

interface CacheSchema {
  schemas: CachedSchemas
  getVersion: (version: number, schemaName: string) => Promise<string>
}

interface CachedSchemas {
  [key: string]: CachedVersions
}

interface CachedVersions {
  [key: number]: string
}

function cacheSchema (RegistryName: string, region: string): CacheSchema {
  const glue = new AWS.Glue({ region })
  return {
    schemas: {},
    getVersion: async function getVersion (VersionNumber, SchemaName) {
      const schema = this.schemas
      let definition = ''
      if (schema[SchemaName] == null) {
        this.schemas[SchemaName] = {}
      }

      if (schema[SchemaName][VersionNumber] != null) {
        definition = schema[SchemaName][VersionNumber]
      } else {
        // get Schema from glue
        const params = {
          SchemaId: {
            RegistryName,
            SchemaName
          },
          SchemaVersionNumber: {
            VersionNumber
          }
        }
        const data = await glue.getSchemaVersion(params).promise().catch((e: Error) => { console.log(e); return null })
        if (data == null || data.SchemaDefinition == null) {
          throw new Error(`Could not find the Schema ${SchemaName}, with version ${VersionNumber.toString()}`)
        }
        definition = data.SchemaDefinition
        // cache the version
        this.schemas[SchemaName][VersionNumber] = definition
      }

      return definition
    }
  }
}

export default cacheSchema
