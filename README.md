# MultiSender - Aptos Blockchain Mass Transfer Tool

## Overview

MultiSender is a decentralized application (dApp) built on the Aptos blockchain that allows users to send APT tokens to multiple recipients in a single transaction. This tool is designed to simplify bulk transfers, making it ideal for tasks such as payroll distribution, airdrops, or any scenario requiring multiple token transfers.

## Features

- Send APT tokens to multiple addresses in one transaction
- User-friendly interface for adding and managing recipients
- Automatic conversion from APT to Octa (Aptos' smallest unit) for precise transfers and vice versa
- Seamless integration with Aptos wallets
- Built with React and Move for robust front-end and smart contract functionality

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Aptos CLI (latest version)
- An Aptos wallet (e.g., Petra, Martian)

## Installation

1. Install the dependencies:

   ```
   npm install
   ```

2. Create a `.env` file in the root directory and add the following:
   ```
   VITE_APP_NETWORK=devnet
   VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS=your_account_address_here
   VITE_MODULE_PUBLISHER_ACCOUNT_PRIVATE_KEY=your_private_key_here
   ```
   Replace `your_account_address_here` and `your_private_key_here` with your Aptos account details.

## Smart Contract Deployment

1. Compile and publish the contract:
   ```
   npm run move:compile
   npm run move:publish
   ```

## Running the Application

1. Start the development server:

   ```
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Usage

1. Connect your Aptos wallet to the dApp.
2. Add recipient addresses and the amount of APT to send to each.
3. Click "Send" to initiate the multi-send transaction.
4. Confirm the transaction in your wallet.

## Contributing

Contributions to the MOVE Multisender project are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgements

- Aptos team for their blockchain technology and developer tools
- React and Vite communities for the front-end framework and build tool
- All contributors who have helped shape this project
