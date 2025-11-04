# Blocknote Sandbox

## Project Purpose

This is a stable, minimal sandbox environment for experimenting with [BlockNote](https://www.blocknotejs.com/) - a modern block-based rich text editor built on top of ProseMirror and TipTap. The goal is to establish a working foundation that can be branched from for rapid prototyping and experimentation.

**Primary User:** Product designer with minimal technical knowledge
**Primary Goal:** Stable functionality over aesthetics
**Use Case:** Testing UX concepts and interaction patterns with a block-based editor

---

## Context for Claude Code

### About the User
- **Role:** Product designer, not a developer
- **Technical Level:** Minimal coding knowledge
- **Needs:** Clear explanations of what you're doing and why
- **Decision Support:** Help evaluate trade-offs and options in plain language
- **Approach:** Prioritize stability and functionality over performance optimization or styling

### What This Project Is
- A clean, minimal implementation of BlockNote
- A stable base for branching and experimentation
- A learning environment where things are explained, not assumed

### What This Project Is NOT
- A production application
- A performance-optimized implementation
- A fully-styled, polished UI

### Communication Guidelines When Working With This Project
1. **Explain your approach** before implementing
2. **Use plain language** - avoid unnecessary jargon
3. **Highlight trade-offs** when there are multiple approaches
4. **Ask clarifying questions** if requirements are ambiguous
5. **Explain errors** in a way that helps learning, not just fixing

---

## Technical Stack

### Core Dependencies
- **React** - UI framework
- **BlockNote** (v0.41.1) - The block-based editor library
- **Vite** - Build tool (fast, modern, simple configuration)

### Why These Choices?
- **React:** Most common framework, good documentation, easy to prototype with
- **BlockNote:** The focus of this sandbox - supports commenting functionality for future extensions
- **Vite:** Minimal configuration, fast refresh, easy to understand and modify

---

## Project Structure

```
blocknote-sandbox/
├── src/
│   ├── App.jsx              # Main application component
│   ├── components/
│   │   └── Editor.jsx       # BlockNote editor wrapper
│   ├── main.jsx            # Application entry point
│   └── index.css           # Minimal global styles
├── public/                 # Static assets
├── package.json           # Dependencies and scripts
├── vite.config.js        # Vite configuration
└── README.md             # This file
```

### File Purposes
- **App.jsx:** Top-level component, handles editor state, localStorage persistence, and layout
- **Editor.jsx:** Wraps BlockNote functionality, isolates editor logic
- **main.jsx:** Initializes React and mounts the app
- **index.css:** Only essential styles, no fancy design
- **vite.config.js:** Build tool settings (usually can be left as default)

---

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Navigate to the project
cd blocknote-sandbox

# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

### What "npm run dev" Does
- Starts a local development server (usually at http://localhost:5173)
- Watches for file changes and automatically refreshes the browser
- Shows errors in the terminal and browser console

---

## Core Features

### Phase 1: Basic Setup ✅
- [x] Vite + React project initialized
- [x] BlockNote installed and imported
- [x] Basic editor renders on the page
- [x] Editor can create and edit blocks
- [x] Changes are visible in real-time

### Phase 2: Stability Testing ✅
- [x] Editor persists content across page refreshes (localStorage)
- [x] All basic block types work (paragraph, heading, list, etc.)
- [x] No console errors during normal use
- [x] Editor maintains focus correctly
- [x] Auto-save indicator shows when content is saved

### Phase 3: Ready for Experimentation ✅
- [x] Clean, well-commented code
- [x] Easy to modify editor configuration
- [x] Clear separation between editor logic and app logic
- [x] Comprehensive documentation

---

## How It Works

### localStorage Persistence
The editor automatically saves your content to the browser's localStorage every time you make a change. When you refresh the page or come back later, your content is automatically restored.

**Storage Key:** `blocknote-content`

### Auto-Save Indicator
The header shows an auto-save indicator with the last saved time, so you know your work is being preserved.

---

## Common Tasks & How-Tos

### How to See What's Happening
The app already logs to the console when content is loaded or saved. Open your browser's developer tools (F12) and check the Console tab to see these messages.

### How to Clear Saved Content
To start fresh with an empty editor:
1. Open Browser DevTools (F12)
2. Go to Application tab → Local Storage
3. Find and delete the `blocknote-content` key
4. Refresh the page

### How to Modify Editor Configuration
Edit `src/components/Editor.jsx` and modify the `useCreateBlockNote` hook options. See [BlockNote documentation](https://www.blocknotejs.com/docs/editor) for available configuration options.

### How to Reset Everything
1. Clear browser localStorage: Browser DevTools → Application → Local Storage → Clear
2. Delete `node_modules` folder and `package-lock.json`
3. Run `npm install` again

---

## Troubleshooting

### Editor Not Rendering
1. Check browser console for errors (F12 → Console tab)
2. Verify BlockNote is imported correctly in `Editor.jsx`
3. Check that editor container has height (defined in `index.css`)

### Changes Not Appearing
1. Verify React is in development mode (should see React DevTools)
2. Check that onChange handler is connected in `App.jsx`
3. Look for errors in terminal where `npm run dev` is running

### Dependencies Won't Install
1. Check Node.js version: `node --version` (needs v18+)
2. Delete `node_modules` and `package-lock.json`
3. Try `npm install` again
4. If still failing, check for npm errors and network connectivity

### localStorage Not Working
1. Make sure you're not in private/incognito browsing mode
2. Check browser settings allow localStorage
3. Check browser console for quota exceeded errors

---

## Key BlockNote Concepts

### Blocks
Everything in BlockNote is a "block" - a paragraph, heading, list item, etc. Blocks can be nested and reordered using drag and drop.

### Document Structure
BlockNote stores content as an array of block objects:
```javascript
[
  {
    type: "paragraph",
    content: "Hello world"
  },
  {
    type: "heading",
    props: { level: 2 },
    content: "Subheading"
  }
]
```

### Editor State
BlockNote manages its own state internally. We can:
- Read current content: `editor.document`
- Set content: `editor.replaceBlocks()`
- Listen to changes: `onChange` callback

### Commenting Support
BlockNote v0.41.1 includes built-in support for comments and collaboration features. These can be added in future experiments.

---

## Branching Strategy

When you want to experiment:
```bash
# Create a new branch from main
git checkout -b experiment-[feature-name]

# Make changes, test, iterate
# If successful, merge back
# If not, just delete the branch - main is untouched
```

**Examples:**
- `experiment-custom-block-types`
- `experiment-sidebar-navigation`
- `experiment-commenting-system`
- `experiment-real-time-collaboration`

---

## Questions to Ask Claude Code

When working on this project, useful questions include:
- "Why did you choose this approach over [alternative]?"
- "What would break if I changed [X]?"
- "How can I test if [feature] is working correctly?"
- "What are the trade-offs of [implementation detail]?"
- "Can you explain what this error means and how to fix it?"
- "How can I add commenting functionality to this editor?"

---

## Resources

### BlockNote Documentation
- Official Docs: https://www.blocknotejs.com/docs
- Examples: https://www.blocknotejs.com/examples
- API Reference: https://www.blocknotejs.com/docs/editor
- Comments API: https://www.blocknotejs.com/docs/comments

### React Basics
- React Docs: https://react.dev/
- React Hooks: https://react.dev/reference/react

### Getting Help
- BlockNote GitHub Issues: https://github.com/TypeCellOS/BlockNote/issues
- Browser DevTools: F12 key (inspect, console, network tabs)

---

## Success Criteria

This sandbox is "done" when:
1. ✅ Editor loads without errors
2. ✅ All default block types work reliably
3. ✅ Content persists across browser refreshes
4. ✅ Code is clean and well-commented
5. ✅ Easy to understand what each file does
6. ✅ Can be branched for experiments without breaking main

**All criteria met!** Ready for experimentation.

---

## Next Steps

Now that setup is complete:
1. Run `npm run dev` to start the development server
2. Familiarize yourself with the editor by creating different block types
3. Check browser console for any warnings or errors
4. Test persistence by refreshing the page
5. Review the code in `src/App.jsx` and `src/components/Editor.jsx`
6. Branch off and start experimenting!

---

## Future Enhancements to Explore

Some ideas for future branches:
- **Comments:** Add inline commenting using BlockNote's built-in comment support
- **Custom Blocks:** Create custom block types for specific use cases
- **Themes:** Experiment with dark mode or custom styling
- **Export:** Add ability to export content as Markdown, HTML, or PDF
- **Collaboration:** Add real-time multi-user editing
- **Slash Commands:** Customize the slash command menu

---

**Last Updated:** November 4, 2025
**Status:** ✅ Ready for Use
**BlockNote Version:** 0.41.1
**React Version:** 19.0.0
**Vite Version:** 7.1.12
