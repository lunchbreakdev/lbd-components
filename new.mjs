import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const sourcePath = './template'

const [, , ...args] = process.argv
const newComponentName = args[0]?.toLocaleLowerCase()

if (!newComponentName) {
  console.log('\x1b[31m' + 'Please provide the new component name as an argument.' + '\x1b[39m')
  process.exit(1)
}

const newComponentNameCapitalized = newComponentName[0].toLocaleUpperCase() + newComponentName.slice(1)

if (fs.existsSync(path.resolve('components', newComponentName))) {
  console.log('The provided component name already exists.')
  process.exit(1)
}

fs.mkdirSync(path.resolve('components', newComponentName), { recursive: true })

const templateFiles = fs.readdirSync(path.resolve(sourcePath), { withFileTypes: true })

for (const file of templateFiles) {
  let content = fs.readFileSync(path.resolve(sourcePath, file.name), 'utf8')

  content = content.replace(/{%template%}/g, newComponentName)
  content = content.replace(/{%Template%}/g, newComponentNameCapitalized)

  fs.writeFileSync(path.resolve('components', newComponentName, file.name.replace(/{%template%}/g, newComponentName)), content)
}

console.log('\x1b[32m' + `New component created successfully: components/${newComponentName}` + '\x1b[39m')

execSync('yarn')

execSync(
  `yarn workspace @lunchbreakdev/lbd-components add @lunchbreakdev/lbd-${
    newComponentName
  }@0.0.0`
)

fs.appendFileSync(
  path.resolve('packages/components/lbd-components.ts'),
  `export * from '@lunchbreakdev/lbd-${newComponentName}'\n`,
)

console.log('\x1b[32m' + `New component added to @lunchbreakdev/lbd-components package` + '\x1b[39m')
