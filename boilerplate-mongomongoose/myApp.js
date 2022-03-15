require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const { Schema } = mongoose;

const personSchema = new Schema({
  name:  String, // String is shorthand for {type: String}
  age: Number,
  favoriteFoods: [String]
});
const Person = mongoose.model('Person', personSchema);


const createAndSavePerson = (done) => {
  valen = new Person({
    name: 'valen',
    age: 20, 
    favoriteFoods: ["ice cream","peanut butter"]});
  valen.save((error,data)=>{
    if(error) return done(error);
    else done(null,data);
  })
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (error,data)=>{
    if(error) return done(error);
    else done(null ,data);
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({name:personName},(error,data)=>{
    if(error) return done(error)
    else done(null,data);
  })
  
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods:[food]},(error,data)=>{
    if(error) return done(error)
    else done(null,data);
  })
};

const findPersonById = (personId, done) => {
  Person.findById({_id:personId},(error,data)=>{
    if(error) return done(error)
    else done(null,data);
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById({_id:personId},(error,person)=>{
    if(error) return console.log(error);
    else{
      person.favoriteFoods.push(foodToAdd);
      person.save((error,updated)=>{
        if(error) return done(error);
        else done(null,updated);
  })
    }
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  let updated = Person.findOneAndUpdate({name:personName}, {age:ageToSet}, {
  new: true
},(error,updated)=>{
        if(error) return done(error);
        else done(null,updated);
  });


};

const removeById = (personId, done) => {
  Person.findByIdAndDelete({_id:personId},(error,deleted)=>{
        if(error) return done(error);
        else done(null,deleted);
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({name: nameToRemove}, (err, response) => {
    if(err) return console.log(err);
    done(null, response);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({favoriteFoods:foodToSearch})
  .sort({name:'asc'})
  .limit(2)
  .select('-age')
  .exec((err, response) => {
    if(err) return console.log(err);
    done(null, response);
  })
  
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
