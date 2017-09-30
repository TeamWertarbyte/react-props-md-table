#!/usr/bin/env node
const reactDocs = require('react-docgen')
const fs = require('fs')
const path = require('path')

const filename = process.argv[process.argv.length - 1]
const content = fs.readFileSync(path.resolve(process.cwd(), filename), 'utf-8')

const component = reactDocs.parse(content)
console.log('|Name|Type|Default|Description|')
console.log('|---|---|---|---|')
for (const name of Object.keys(component.props)) {
  const { type, required, description, defaultValue } = component.props[name]
  console.log(`|${name}${required ? '*' : ''}|\`${formatType(type)}\`|${defaultValue != null ? `\`${defaultValue.value}\`` : ''}|${description}`)
}
if (Object.keys(component.props).some((name) => component.props[name].required)) {
  console.log('\\* required property')
}

function formatType (type) {
  if (type.name === 'union') {
    return type.value.map(formatType).join('|')
  } else {
    return type.name
  }
}
