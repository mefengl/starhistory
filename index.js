#!/usr/bin/env node

import process from 'node:process'
import readline from 'node:readline'
import getUrls from 'get-urls'
import open from 'open'

function extractGitHubUrls(text) {
  const urls = getUrls(text)
  return Array.from(urls).filter(url => url.includes('github.com'))
}

function generateStarHistoryLink(githubUrls) {
  const repoPaths = githubUrls.map((url) => {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/)
    return match ? match[1] : null
  }).filter(Boolean)

  return `https://star-history.com/#${repoPaths.join('&')}`
}

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}

async function processInput() {
  const inputRl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  console.log('Enter URLs (Ctrl+D to finish):')

  const lines = []
  for await (const line of inputRl)
    lines.push(line)

  inputRl.close()

  try {
    const input = lines.join('\n')
    const githubUrls = extractGitHubUrls(input)
    const starHistoryLink = generateStarHistoryLink(githubUrls)
    console.log('StarHistory Link:')
    console.log(starHistoryLink)

    const answer = await askQuestion('Do you want to open the link? (yes/no, default is yes) ')
    if (answer.toLowerCase() !== 'n' && answer.toLowerCase() !== 'no')
      await open(starHistoryLink)
  }
  catch (error) {
    console.error(`An error occurred: ${error.message}`)
  }
}

processInput()
