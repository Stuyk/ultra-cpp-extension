# Ultra.io Smart Contract Toolkit

Build smart contracts, and get rid of those annoying squigglies while working with smart contracts on EOS based chains.

## Features

- Add header files to any smart contract workspace for easy auto-completion
- Ability to compile smart contracts using Docker images

## Prerequisities

**Make sure you have docker installed while using this tool!**

- Docker
- [Microsoft C++ Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)

## Commands

These can be accessed with `(CTRL / CMD) + SHIFT + P` or through the Command Palette.

- Ultra: Build Contract
  - Builds your smart contract
- Ultra: Add C++ Header Files for EOSIO
  - Adds header files to your smart contract workspace
- Ultra: Scaffold Contract Legacy
  - Creates a smart contract template based on legacy templating
- Ultra: Create Smart Contract
  - Creates a smart contract template

## Previews

![](https://i.imgur.com/4KnGPnP.png)

![](https://i.imgur.com/7aMksvK.png)

## FAQ

- Q. What activates the prompt to install headers?
  - A. Open any `.cpp` file and it will prompt you to add header files.

<br />

- Q. It stopped working, what can I do to fix it?
  - A. re-install this extension, and remove your `.vscode`, and `lib` folder from your workspace folder.

<br />

- Q. My smart contracts aren't compiling.
  - A. Ensure that you can run `docker` from the `CLI`. If not, install docker. 

<br />

- Q. How do I select which contract to compile in a monorepo?
  - A. Open the root `.cpp` file of the smart contract in VSCode, and have it as the active file. 