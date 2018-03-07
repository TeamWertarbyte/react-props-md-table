#!/usr/bin/env node
const reactDocs = require('react-docgen')
const fs = require('fs')
const path = require('path')

const args = process.argv.slice(1)
const filename = args[args.length - 1]
const content = fs.readFileSync(path.resolve(process.cwd(), filename), 'utf-8')
const pretty = args.includes('--pretty') || args.includes('-p')

const component = reactDocs.parse(content)

const props = Object.entries(component.props).map(([name, { type, required, description, defaultValue }]) => ({
  name: `${name}${required ? '*' : ''}`,
  defaultValue: `${defaultValue != null ? `\`${defaultValue.value}\`` : ''}`,
  type: `\`${formatType(type)}\``,
  description
}))

const headers = ['Name', 'Type', 'Default', 'Description']
if (pretty) {
  const columnWidths = [
    Math.max(4, ...props.map(({name}) => name.length)),
    Math.max(4, ...props.map(({type}) => type.length)),
    Math.max(7, ...props.map(({defaultValue}) => defaultValue.length)),
    Math.max(11, ...props.map(({description}) => description.length))
  ]

  console.log(`|${headers.map((h, i) => fill(h, columnWidths[i])).join('|')}|`)
  console.log(`|${columnWidths.map((width) => '-'.repeat(width)).join('|')}|`)
  for (const { name, defaultValue, type, description } of props) {
    console.log(`|${fill(name, columnWidths[0])}|${fill(type, columnWidths[1])}|${fill(defaultValue, columnWidths[2])}|${fill(description, columnWidths[3])}|`)
  }
} else {
  console.log(`|${headers.join('|')}|`)
  console.log(`|${headers.map(() => '---').join('|')}|`)
  for (const { name, defaultValue, type, description } of props) {
    console.log(`|${name}|${defaultValue}|${type}|${description}|`)
  }
}

if (Object.keys(component.props).some((name) => component.props[name].required)) {
  console.log('')
  console.log('\\* required property')
}

function formatType (type) {
  if (type.name === 'union') {
    return type.value.map(formatType).join('|')
  } else {
    return type.name
  }
}

function fill (string, length) {
  while (string.length < length) {
    string += ' '
  }
  return string
}
