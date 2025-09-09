
####  Create a README file to answer the following question-


#### 1) What is the difference between var, let, and const?

1. Answer: var : function scoped, re-declare & re-assign করা যায়, hoisting হয় (value = undefined)।

let : block scoped, re-declare করা যায় না, re-assign করা যায়, hoisting হয় কিন্তু temporal dead zone এ থাকে।

const : block scoped, re-declare করা যায় না, re-assign করা যায় না (তবে object/array এর ভেতরের value change করা যায়)।

#### 2) What is the difference between map(), forEach(), and filter()? 

2. Answer: forEach() : শুধু loop চালায়, কিছু return করে না।

map() : প্রতিটি element পরিবর্তন করে নতুন array দেয়।

filter() : শর্ত মেনে element বেছে নিয়ে নতুন array দেয়।

#### 3) What are arrow functions in ES6?

3. Answer: Arrow functions হলো ES6 এ short syntax function,
             () => {} এভাবে লেখা হয়।

#### 4) How does destructuring assignment work in ES6?

4. Answer: Destructuring assignment হলো ES6 feature যা array বা object থেকে values বের করে variables এ সরাসরি assign করতে দেয়।

#### 5) Explain template literals in ES6. How are they different from string concatenation?

5. Answer: Template literals হলো ES6 feature যা backticks ` দিয়ে লেখা হয় এবং ${} দিয়ে variables/embed করা যায়।
   Difference: পুরনো concatenation messy হয়, template literals clean ও multi-line support করে।

