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

    await open(starHistoryLink)
  }
  catch (error) {
    console.error(`An error occurred: ${error.message}`)
  }
}

processInput()
