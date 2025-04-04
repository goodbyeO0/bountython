# Solana Blinks Ticket Platform

A revolutionary platform that enables users to purchase tickets directly from social media platforms like X (Twitter) and Discord using Solana Blinks.

## Overview

This application leverages Solana Blinks technology to create seamless ticket purchasing experiences across social media platforms. Users can buy tickets with SOL tokens directly from their favorite social media platforms without leaving the platform.

## Features

- **Direct Social Media Integration**: Purchase tickets directly from X (Twitter) and Discord
- **Solana Blinks Support**: Secure and fast transactions using Solana blockchain
- **Simple Purchase Flow**: One-click ticket purchases with SOL tokens
- **Contact Information Collection**: Secure collection of buyer information for ticket delivery
- **Real-time Transaction Tracking**: Monitor your ticket purchase status

## How It Works

1. Users discover ticket links on social media platforms
2. Click the Blink to initiate the purchase
3. Enter contact information (email)
4. Confirm the SOL transfer
5. Receive ticket confirmation

## Technical Details

The application uses:

- Solana Web3.js for blockchain interactions
- Solana Blinks for social media integration
- RESTful API endpoints for transaction processing
- Devnet support for development

## API Endpoints

The application provides the following API endpoints:

- `/api/actions/transfer-sol`: Handles SOL transfers for ticket purchases
- `/api/actions/contact-info`: Manages contact information collection
- `/api/actions/transaction-data`: Tracks transaction status

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up your Solana RPC endpoint
4. Configure environment variables
5. Run the application

## Environment Variables

Required environment variables:

- `SOLANA_RPC`: Your Solana RPC endpoint
