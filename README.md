![CovidPass](https://covidpass.dvlpr.xyz/thumbnail.png)

This web app offers the ability to add your [California Digital Covid-19 Vaccine Record](https://myvaccinerecord.cdph.ca.gov/) as a pass into your Apple Wallet®. CovidPass accomplishes this without sending your data to a server and instead only uses a hashed representation for the signing step.

# Getting started

If you want to add your vaccination certificate into your wallet with CovidPass, there are two main options.

* Use the [CovidPass web app](https://covidpass.dvlpr.xyz) hosted by us
* Use your own Apple Developer Certificate to generate a pass

Note that the latter option requires you to have an [Apple Developer Account](https://developer.apple.com) and is a more complicated process.

# Quick start

## Using our service

* Go to [https://covidpass.dvlpr.xyz](https://covidpass.dvlpr.xyz)
* Select or scan the screenshot/PDF with the QR code
* Pick a background color
* Add your certificate to the wallet

## Running it yourself

Note that the following options do not have support for actually converting your certificates as they lack the API connection for the signing step.
You can read about how you can use your own Apple Developer Certificate in the chapter below.

## Get your your own Apple Developer Certificate

* Sign into your [Apple Developer Account](https://developer.apple.com/account/)
* Go to Certificates, Identifiers and Profiles
* Register a new Pass Type Identifier under the Identifiers tab
* Create a new Pass Type ID Certificate under the Certificates tab
* Select your previously created Pass Type Identifier in the process
* Move your new certificate to the My Certificates tab in the keychain
* Export your certificate as a .p12 file
* Install node.js and download the [passkit-keys](https://github.com/walletpass/pass-js/blob/master/bin/passkit-keys) script
* Create a `keys` folder and put the .p12 file inside
* Run ./passkit-keys `<path to your keys folder>`
* Type in the passphrase you defined during the export step
* Open the generated .pem file
* Copy your private key and save to a new file, i.e. ~/Desktop/privatekey.txt
* Copy your certificate
* Replace [my certificate](https://github.com/flochtililoch/covidpass/blob/main/pages/api/sign.tsx#L35-L68) with yours


### Debug the web app

```sh
yarn install
PASSPHRASE=<replace with your passphrase> PRIVATE_KEY=`cat ~/Desktop/privatekey.txt` yarn dev
```

### Run the web app in prod

```sh
yarn build
PASSPHRASE=<replace with your passphrase> PRIVATE_KEY=`cat ~/Desktop/privatekey.txt` BASE_URL=https://your.own.domain yarn start
```

# FAQ

#### I do not want to trust a third party with my vaccination data, what makes this a secure option?

Processing of your data happens entirely in your browser and only a hashed representation is sent to the server for the signing step.

#### How do I make sure that nobody can access my vaccination pass from the lock screen (iOS)?

Navigate to the "TouchID & Code" or "FaceID & Code" or just "Code" section in the Settings and switch the toggle to off for Wallet in the section "Allow access from the lock screen". Also see [this official guide](https://support.apple.com/guide/iphone/control-access-information-lock-screen-iph9a2a69136/ios) from Apple.

#### Why is my certificate not recognized?

We are in an early development stage and actively working on improving support for all vaccines. Feel free to create an issue describing the problem you faced.

# Explanation of the process

The whole process of generating the pass file happens locally in your browser. For the signing step, only a hashed representation of your data is sent to the server.

First, the following steps happen locally in your browser:

* Recognizing and extracting the QR code data from your selected certificate
* Decoding your personal and health-related data from the QR code payload
* Assembling an incomplete pass file out of your data
* Generating a file containing hashes of the data stored in the pass file
* Sending only the file containing the hashes to the server

Second, the following steps happen on the server:

* Receiving and checking the hashes which were generated locally
* Signing the file containing the hashes
* Sending the signature back

Finally, the following steps happen locally in your browser:

* Assembling the signed pass file out of the incomplete file generated locally and the signature
* Saving the file on your device

# Privacy policy of our service

You can find the full privacy policy of our service [here](https://covidpass.dvlpr.xyz/privacy).

# Credits

Credits go to [Marvin Sextro](https://marvinsextro.de) for developing the original [CovidPass](https://covidpass.marvinsextro.de), which allows European citizens to add their digital COVID-19 certificates to the Apple Wallet® app.
The idea for this web app originated from the [solution of an Austrian web developer](https://coronapass.fabianpimminger.com), which only works for Austrian certificates at the moment.

# Contribute

Any contribution to this project is welcome. Feel free to leave your suggestions, issues or pull requests.
