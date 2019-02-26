# nuSwitch Energy Comparison

##### Table of Contents

<a href="#intro">Intro</a><br>
<a href="#installation">Installation</a><br>
<a href="#testing">Testing</a><br>
<a href="#price">Price</a><br>
<a href="#usage">Usage</a><br>
<a href="#further-improvements">Further Improvements</a><br>

## Intro

As part of the interview process at uSwitch I was given the technical challenge
to build the "nuSwitch Energy Comparison" system. I have decided to use JavaScript (Node)
and Jest as a testing framework. Please find some notes on how I have implemented
my solution as well as detailed instructions on how to test it below.

![feb-26-2019 01-24-56](https://user-images.githubusercontent.com/11490137/53380505-8c4f5400-3965-11e9-965b-e051cf78c752.gif)

## Installation

##### Prerequisites
```
npm v6.4.1 or later
node v10.15.1 or later
```

##### Instructions
```
1 - Download and unzip nusiwtch-energy-comparison--velizar-genov.zip
2 - cd nusiwtch-energy-comparison--velizar-genov
3 - npm install
4 - npm run checkDiff

see the sections below for more information
```

```
/**
  * Runs `./bin/comparison.js plans.json < inputs`
  * It saves the result in a file called actual_output
  * It finally compares the two files
  */

npm run checkDiff
```

```
>> Prints the result in the console
./bin/comparison.js plans.json < inputs

>> Saves the result in a file called actual_output
./bin/comparison.js plans.json < inputs > actual_output

>> Compares the two files, i.e. actual_output and expected_output
diff -s actual_output expected_output
```

## Testing

### Code
```
// Run unit tests
$ npm test
```

<img width="700" alt="screenshot 2019-02-25 at 21 56 43" src="https://user-images.githubusercontent.com/11490137/53378615-1eebf500-395e-11e9-9898-f9c8b433300c.png"><br>

<img width="700" alt="screenshot 2019-02-25 at 23 29 20" src="https://user-images.githubusercontent.com/11490137/53378628-362ae280-395e-11e9-9875-d2ac98c569c6.png"><br>

<img width="700" alt="screenshot 2019-02-25 at 23 32 54" src="https://user-images.githubusercontent.com/11490137/53378643-404ce100-395e-11e9-8f2a-25d2649c25cb.png"><br>

## Price

I used a paper and a pen in order to verify all calculations fromt he sample data. Once this was done I moved to implementing the solution. I came up with those steps for the first part of the challenge:

1. Generate the raw result using reduce<br>
1.1. If there is no threshold(s) available calculate the raw result by multipling the usage by the price<br>
1.2. If there is threshold(s) calculate what the max threshold is and multiply it to the price<br>
1.3. If there is a standing charge available, add it to the computed rate<br>
1.4. Return an object that holds information about the supplier, the plan and the final rate<br>
2. Sort the result from 1 based on finalRate<br>
3. Iterrate through each element from the result from 2<br>
3.1. Print each row in format supplier,plan,finalRate<br>
3.2. Store the result in an array and return it so it can be used to facilitate the testing of the functionality

## Usage

Similarly to the price method, first and foremost, I used a paper and pen to manually make all computations for the sample data and only then I moved to the implementation. I came up with the following steps to help me achieve the final goal of this part of the task:

1. Get data for requested supplier and plan<br>
2. Calculate the amount in pence without VAT and Standing Charge <br>
2.1. Calculate the annual spend amount<br>
2.2. Convert pounds to pence<br>
2.3. Remove VAT<br>
2.4. Remove standing charge if applicable<br>
3. In order to avoid heavy computations split logic conditionaly on threshold availability<br>
3.1. If there is no threshold calculate the amount of energy directly<br>
3.2. If there is threshold(s) calculate the amount of energy following the steps<br>
3.2.1 Get the amount of total threshold(s) and total price for this threshold(s) and keep a track of them<br>
3.2.2 Calculate the energy with the threshold taken into account<br>
4. Print the result to the console


## Further Improvements

My main focus has been completing the task and delivering a good quality Minimum Viable Product (MVP), covering
all requirements listed in the task. There are, of course, number of things that could be improved in further horizons.

For example, the set up around retrieving the testing data is very basic. Some validation could be added as currently there are some cases when the application could crash if incorrect input is provided.

More, by adding babel to the project, the syntax could be improved, for example, by using import instead of require. However, I wanted to keep the set up as simple as possible and hence I don't believe this is something that brings enought value to be used in this particular case.

There are other node modules (lodash for example) that could be used in order to simplify or improve the code.

Finally, additional refactoring could be done to both the price and the usage files. Some of the functionality in both files could potentially be extracted in a helper file and shared between the two. Similarly, I do not think this is causing any major issues and am happy to improve it in my spare time in the future.

## Author
Velizar Genov for uSwitch