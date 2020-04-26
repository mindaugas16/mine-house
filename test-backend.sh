#!/bin/sh
set -e

# Test backend
cd backend
npm install
npm run test
