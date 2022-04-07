# Mahi Gaming: Game Dev Skills Assessment

## 1. Overview

This is the Mahi Gaming game developer skills assessment. This project includes the boilerplate necessary to run your game so you can focus on the task at hand (programming) rather than wiring up a node/typescript project.

This project serves only as a skeleton. How you structure and organize your project is up to you. You are free to modify anything.

The pixi.js renderer has been included. You are free to use it or use your own rendering solution.

It's recommended to use Visual Studio Code for your editing.

## 2. Project Setup

### Prerequisites

You should have Node.js 12+ (and npm) installed.

### Install Dependencies

From a terminal within this project's root directory, run:

```sh
npm install
```

This will install all necessary dependencies. This only needs to be run once. Disregard any warnings, as they will not impact your project.

### Running The Project

To run the project, within your project's root directory, run:

```sh
npm start
```

This will launch a webpack development server. Once started, your browser window will auto-refresh when code changes are made.
The base skeleton will render a black box and nothing more. Build upon this blank canvas as you please.

## 3. Tasks

### a. Slot Machine UML/Class Diagram/Flow Chart

You are required to create a UML or equivalent Class Diagram with an accompanying Flow Chart for a slot game.

### b. Slot Machine Implementation

You are required to develop a slot game using programmatic motion for the spinning reels. There should be 5 reels, with 3 symbols visible on each reel.

From a test perspective, you must provide a mechanism that allows reel targets to be set. When the reels are spun, it must stop at this predefined target.

This must support responsive browsing. Your game canvas should fit to the screen at any resolution.

## 4. Bonuses

1. Add unit tests. Unit testing support has already been added to this project via jest.

2. Support dynamic number of reels/rows.

3. Support multiple directions of spinning reels.

4. Any other clever ideas you may have to demonstrate your abilities.
