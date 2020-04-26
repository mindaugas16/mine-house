#!/bin/sh
set -e

# Test backend
cd frontend
npm install
npm run test
