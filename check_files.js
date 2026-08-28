import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

// Note: This is an overly simple attempt to check if the built files would crash.
// But better to just check the entry point.

async function checkEntryPoint() {
  const mainPath = path.resolve('src/main.jsx');
  const mainContent = fs.readFileSync(mainPath, 'utf8');
  console.log("main.jsx content length:", mainContent.length);
  
  const appPath = path.resolve('src/App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  console.log("App.jsx content length:", appContent.length);
}

checkEntryPoint();
