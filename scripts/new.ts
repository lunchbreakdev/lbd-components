import { execSync } from 'child_process'
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs'
import { resolve } from 'path'

const [, , ...args] = process.argv
const newComponentName = args[0]?.toLocaleLowerCase()

if (!newComponentName) {
  console.log(
    '\x1b[31m' +
      'Please provide the new component name as an argument.' +
      '\x1b[39m',
  )
  process.exit(1)
}

const sourcePath = resolve(__dirname, '../template')
const newPath = resolve(__dirname, '../components', newComponentName)

const newComponentNameCapitalized =
  newComponentName[0].toLocaleUpperCase() + newComponentName.slice(1)

if (existsSync(newPath)) {
  console.log('The provided component name already exists.')
  process.exit(1)
}

mkdirSync(newPath, { recursive: true })

const templateFiles = readdirSync(sourcePath, { withFileTypes: true })

for (const file of templateFiles) {
  let content = readFileSync(resolve(sourcePath, file.name), 'utf8')

  content = content.replace(/{%template%}/g, newComponentName)
  content = content.replace(/{%Template%}/g, newComponentNameCapitalized)

  writeFileSync(
    resolve(newPath, file.name.replace(/{%template%}/g, newComponentName)),
    content,
  )
}

console.log(
  '\x1b[32m' +
    `New component created successfully: components/${newComponentName}` +
    '\x1b[39m',
)

execSync('yarn')

appendFileSync(
  resolve(__dirname, '../packages/components/lbd-components.ts'),
  `export * from '../../components/${newComponentName}/lbd-${newComponentName}'\n`,
)

console.log(
  '\x1b[32m' +
    `New component added to @lunchbreakdev/lbd-components package` +
    '\x1b[39m',
)
