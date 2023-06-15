# Ultra.io Smart Contract Toolkit

This VSCode extension enables header files for `C++` files. 

It auto-injects `EOSIO` based C++ header files and enables auto-completion in VSCode.

It also allows you to build contracts using the VSCode Command Palette.

Simply press `CTRL + SHIFT + P` and type `Ultra: Build Contract`.

## Features

- Add header files to any smart contract workspace for easy auto-completion
- Ability to compile smart contracts using Docker images

## Prerequisities

**Make sure you have docker installed while using this tool!**

- Docker

## Usage

Create a `.cpp` file and a prompt in the bottom-right will ask you to install header files.

Make sure you have the [Microsoft C++ Extension Installed](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools).

## Previews

![](https://i.imgur.com/CwGOLcl.png)
![](https://i.imgur.com/cP984JY.png)

## FAQ

- Q. What activates the prompt?
  - A. Open any `C++` file and it will prompt you to add header files.

<br />

- Q. It stopped working, what can I do to fix it?
  - A. re-install this application, and remove your `.vscode` folder from your workspace folder.

<br />

- Q. My smart contracts aren't compiling.
  - A. Ensure that you can run `docker` from the `CLI`. If not, install docker. 

<br />

- Q. How do I select which contract to compile in a monorepo?
  - A. Open the root file of the project in VSCode, and have it as the active editor. 