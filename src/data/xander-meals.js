// ============ XANDER MEALS — Full Recipe Database ============
// 28 meals: 7 breakfast, 7 lunch, 7 dinner, 7 snacks
// Each has: cal, protein, cookTime, difficulty, grabAndGo, description, ingredients (with qty/unit/aisle), steps

export const DAILY_TARGET = { cal: 3100, protein: 140 };

export const SLOT_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack1: 'Snack 1', snack2: 'Snack 2' };
export const SLOTS = ['breakfast', 'lunch', 'dinner', 'snack1', 'snack2'];
export const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

export const MEALS = {
breakfast: [
{ id:'b1', name:'Loaded Scrambled Eggs & Toast', cal:650, protein:38, cookTime:'12 min', difficulty:'Easy', grabAndGo:false,
  description:'Fluffy cheesy scrambled eggs on buttered toast.',
  ingredients:[{item:'large eggs',qty:4,unit:'whole',aisle:'Dairy & Eggs'},{item:'shredded cheddar cheese',qty:0.5,unit:'cup',aisle:'Dairy & Eggs'},{item:'butter',qty:2,unit:'tbsp',aisle:'Dairy & Eggs'},{item:'whole wheat bread',qty:2,unit:'slices',aisle:'Bread & Bakery'},{item:'whole milk',qty:1,unit:'cup',aisle:'Dairy & Eggs'}],
  steps:['Crack 4 eggs into a bowl. Add salt and pepper. Beat with a fork 30 sec.','Non-stick pan MEDIUM-LOW. Add 1 tbsp butter, melt, tilt to coat.','Pour eggs in. Wait 20 sec until edges set. Push from edges to center. Wait 15 sec, push again.','When mostly set but still shiny, sprinkle cheese. Fold eggs over cheese. Turn off heat.','Toast 2 slices. Spread remaining butter. Plate with eggs. Glass of milk.']},
{ id:'b2', name:'PB&J Power Stack', cal:620, protein:22, cookTime:'3 min', difficulty:'No Cook', grabAndGo:true,
  description:'Double-thick PB&J with a banana and cold milk. Zero cooking.',
  ingredients:[{item:'whole wheat bread',qty:2,unit:'slices',aisle:'Bread & Bakery'},{item:'peanut butter',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'grape jelly',qty:2,unit:'tbsp',aisle:'Pantry'},{item:'banana',qty:1,unit:'whole',aisle:'Produce'},{item:'whole milk',qty:1.5,unit:'cups',aisle:'Dairy & Eggs'}],
  steps:['Spread 3 tbsp peanut butter thick on one slice.','Spread 2 tbsp jelly on the other. Press together.','Peel banana. Pour 1.5 cups milk. 620 calories done.']},
{ id:'b3', name:'Overnight Protein Oats', cal:580, protein:26, cookTime:'5 min prep', difficulty:'No Cook', grabAndGo:true,
  description:'Prep night before, grab from fridge in the morning.',
  ingredients:[{item:'rolled oats',qty:1,unit:'cup',aisle:'Pantry'},{item:'whole milk',qty:1,unit:'cup',aisle:'Dairy & Eggs'},{item:'Greek yogurt',qty:0.5,unit:'cup',aisle:'Dairy & Eggs'},{item:'peanut butter',qty:2,unit:'tbsp',aisle:'Pantry'},{item:'honey',qty:1,unit:'tbsp',aisle:'Pantry'},{item:'banana',qty:1,unit:'whole',aisle:'Produce'}],
  steps:['NIGHT BEFORE: Pour 1 cup oats into jar.','Add milk, yogurt, peanut butter, honey. Stir 30 sec.','Lid on, fridge. Go to bed.','MORNING: Take out. Slice banana on top. Eat cold or microwave 90 sec.']},
{ id:'b4', name:'Beef Breakfast Burrito', cal:720, protein:42, cookTime:'15 min', difficulty:'Easy', grabAndGo:false,
  description:'Scrambled eggs and seasoned ground beef in a warm tortilla.',
  ingredients:[{item:'large eggs',qty:3,unit:'whole',aisle:'Dairy & Eggs'},{item:'ground beef (80/20)',qty:0.25,unit:'lb',aisle:'Meat'},{item:'large flour tortilla',qty:1,unit:'whole',aisle:'Bread & Bakery'},{item:'shredded cheddar',qty:0.33,unit:'cup',aisle:'Dairy & Eggs'},{item:'salsa',qty:2,unit:'tbsp',aisle:'Pantry'},{item:'butter',qty:1,unit:'tbsp',aisle:'Dairy & Eggs'}],
  steps:['MEDIUM heat. Brown beef 5-6 min, break into crumbles.','Push beef aside. Add butter. Beat 3 eggs, pour onto butter. Scramble 2 min.','Mix eggs and beef. Sprinkle cheese. Turn off heat, let melt 30 sec.','Microwave tortilla 15 sec. Spoon down center. Add salsa. Fold bottom up, sides in, roll.']},
{ id:'b5', name:'PB Banana Pancakes', cal:680, protein:20, cookTime:'15 min', difficulty:'Easy', grabAndGo:false,
  description:'Fluffy pancakes with peanut butter drizzle and sliced bananas.',
  ingredients:[{item:'pancake mix',qty:1.5,unit:'cups',aisle:'Pantry'},{item:'whole milk',qty:1,unit:'cup',aisle:'Dairy & Eggs'},{item:'large egg',qty:1,unit:'whole',aisle:'Dairy & Eggs'},{item:'peanut butter',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'banana',qty:1,unit:'whole',aisle:'Produce'},{item:'maple syrup',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'butter',qty:1,unit:'tbsp',aisle:'Dairy & Eggs'}],
  steps:['Mix pancake mix, milk, egg. Stir until JUST combined — lumps OK.','Non-stick pan MEDIUM. Add butter.','Pour 1/4 cup per pancake. When bubbles form and edges dry (~2 min), flip. Cook 1-2 more min.','Stack. Microwave PB 20 sec to make runny. Drizzle over stack. Slice banana on top. Syrup.']},
{ id:'b6', name:'Yogurt Parfait XL', cal:520, protein:28, cookTime:'3 min', difficulty:'No Cook', grabAndGo:true,
  description:'Layered Greek yogurt with granola, berries, and honey.',
  ingredients:[{item:'Greek yogurt',qty:1.5,unit:'cups',aisle:'Dairy & Eggs'},{item:'granola',qty:0.75,unit:'cup',aisle:'Pantry'},{item:'mixed berries',qty:0.5,unit:'cup',aisle:'Produce'},{item:'honey',qty:2,unit:'tbsp',aisle:'Pantry'}],
  steps:['Layer in glass: half yogurt, some granola, half berries.','Add remaining yogurt, granola, berries. Drizzle honey.']},
{ id:'b7', name:'Sausage Egg & Cheese Muffin', cal:580, protein:32, cookTime:'10 min', difficulty:'Easy', grabAndGo:false,
  description:'Homemade breakfast sandwich that beats any drive-through.',
  ingredients:[{item:'English muffins',qty:1,unit:'whole',aisle:'Bread & Bakery'},{item:'breakfast sausage patties',qty:2,unit:'whole',aisle:'Meat'},{item:'large eggs',qty:2,unit:'whole',aisle:'Dairy & Eggs'},{item:'American cheese',qty:1,unit:'slice',aisle:'Dairy & Eggs'},{item:'butter',qty:1,unit:'tbsp',aisle:'Dairy & Eggs'},{item:'whole milk',qty:1,unit:'cup',aisle:'Dairy & Eggs'}],
  steps:['Cook sausage patties MEDIUM, 3-4 min per side. Set aside.','Same pan, butter on MEDIUM-LOW. Fry 2 eggs 2-3 min.','Toast muffin. Stack: bottom, sausage, cheese, eggs, top. Hot egg melts cheese.','Glass of milk on the side.']},
],
lunch: [
{ id:'l1', name:'Chicken & Rice Power Bowl', cal:720, protein:48, cookTime:'25 min', difficulty:'Easy', grabAndGo:false,
  description:'Seasoned chicken over rice with broccoli. The classic.',
  ingredients:[{item:'chicken breast',qty:8,unit:'oz',aisle:'Meat'},{item:'white rice',qty:1,unit:'cup dry',aisle:'Pantry'},{item:'broccoli florets',qty:2,unit:'cups',aisle:'Produce'},{item:'olive oil',qty:2,unit:'tbsp',aisle:'Pantry'},{item:'soy sauce',qty:2,unit:'tbsp',aisle:'Pantry'},{item:'garlic powder',qty:1,unit:'tsp',aisle:'Pantry'}],
  steps:['RICE FIRST: 1 cup rice + 2 cups water, pinch salt. Boil HIGH, then LOW lid on 18 min. Don\'t open.','Season chicken with garlic powder, salt, pepper. If thick, cut in half horizontally.','Pan MEDIUM-HIGH with 1 tbsp oil. Cook chicken 5-6 min per side until no pink. Rest 2 min, slice.','Same pan remaining oil: broccoli 4-5 min until bright green.','Build bowl: rice, chicken, broccoli. Drizzle soy sauce.']},
{ id:'l2', name:'Beef Tacos (3 tacos)', cal:780, protein:38, cookTime:'15 min', difficulty:'Easy', grabAndGo:false,
  description:'Three loaded beef tacos with all the toppings.',
  ingredients:[{item:'ground beef (80/20)',qty:0.5,unit:'lb',aisle:'Meat'},{item:'taco seasoning',qty:0.5,unit:'packet',aisle:'Pantry'},{item:'flour tortillas (small)',qty:3,unit:'whole',aisle:'Bread & Bakery'},{item:'shredded cheddar',qty:0.5,unit:'cup',aisle:'Dairy & Eggs'},{item:'shredded lettuce',qty:1,unit:'cup',aisle:'Produce'},{item:'salsa',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'sour cream',qty:2,unit:'tbsp',aisle:'Dairy & Eggs'}],
  steps:['MEDIUM-HIGH. Brown beef 5-6 min. Drain grease (NEVER down the sink).','LOW heat. Add taco seasoning + 3 tbsp water. Stir. Simmer 2 min.','Warm tortillas in microwave 30 sec with damp paper towel.','Build: tortilla, beef, cheese, lettuce, salsa, sour cream.']},
{ id:'l3', name:'PB&J + Trail Mix Combo', cal:720, protein:20, cookTime:'3 min', difficulty:'No Cook', grabAndGo:true,
  description:'The ultimate no-cook lunch. Pack it and eat anywhere.',
  ingredients:[{item:'whole wheat bread',qty:2,unit:'slices',aisle:'Bread & Bakery'},{item:'peanut butter',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'grape jelly',qty:2,unit:'tbsp',aisle:'Pantry'},{item:'trail mix',qty:0.5,unit:'cup',aisle:'Pantry'},{item:'apple',qty:1,unit:'whole',aisle:'Produce'},{item:'string cheese',qty:2,unit:'sticks',aisle:'Dairy & Eggs'}],
  steps:['Make PB&J. Bag of trail mix. Apple. 2 string cheese. 720 cal, zero effort.']},
{ id:'l4', name:'Chicken Quesadilla', cal:680, protein:44, cookTime:'15 min', difficulty:'Easy', grabAndGo:false,
  description:'Crispy tortilla stuffed with chicken and melted cheese.',
  ingredients:[{item:'chicken breast',qty:6,unit:'oz',aisle:'Meat'},{item:'large flour tortillas',qty:2,unit:'whole',aisle:'Bread & Bakery'},{item:'shredded Mexican cheese',qty:1,unit:'cup',aisle:'Dairy & Eggs'},{item:'butter',qty:1,unit:'tbsp',aisle:'Dairy & Eggs'},{item:'salsa',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'sour cream',qty:2,unit:'tbsp',aisle:'Dairy & Eggs'}],
  steps:['Cook and dice chicken (or use rotisserie). Lay tortilla in pan (heat OFF). Half cheese, chicken, rest of cheese, second tortilla.','MEDIUM-LOW, 3-4 min until golden. Flip carefully. Cook other side 3-4 min.','Cut into triangles. Serve with salsa and sour cream.']},
{ id:'l5', name:'Loaded Baked Potato', cal:820, protein:38, cookTime:'15 min', difficulty:'Easy', grabAndGo:false,
  description:'Giant potato loaded with beef, cheese, and sour cream.',
  ingredients:[{item:'large russet potato',qty:1,unit:'whole',aisle:'Produce'},{item:'ground beef (80/20)',qty:0.33,unit:'lb',aisle:'Meat'},{item:'shredded cheddar',qty:0.5,unit:'cup',aisle:'Dairy & Eggs'},{item:'sour cream',qty:3,unit:'tbsp',aisle:'Dairy & Eggs'},{item:'butter',qty:2,unit:'tbsp',aisle:'Dairy & Eggs'}],
  steps:['Wash potato, poke with fork 6-8 times. Microwave HIGH 5 min, flip, 3-5 more until fork slides in.','Brown beef 5-6 min. Drain. Season.','Cool 1 min. Cut slit on top, squeeze ends to open. Add butter, beef, cheese, sour cream.']},
{ id:'l6', name:'Chicken Caesar Wrap', cal:620, protein:38, cookTime:'10 min', difficulty:'Easy', grabAndGo:true,
  description:'Caesar salad in a tortilla. Easy to eat on the go.',
  ingredients:[{item:'chicken breast',qty:6,unit:'oz',aisle:'Meat'},{item:'large flour tortilla',qty:1,unit:'whole',aisle:'Bread & Bakery'},{item:'romaine lettuce',qty:2,unit:'cups chopped',aisle:'Produce'},{item:'Caesar dressing',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'shredded Parmesan',qty:3,unit:'tbsp',aisle:'Dairy & Eggs'}],
  steps:['Cook chicken (or use rotisserie). Slice into strips.','Toss romaine, chicken, dressing, Parmesan in bowl.','Spoon down center of tortilla. Fold bottom up, sides in, roll tight. Wrap in foil for on-the-go.']},
{ id:'l7', name:'Beef & Veggie Stir Fry Bowl', cal:730, protein:36, cookTime:'20 min', difficulty:'Easy', grabAndGo:false,
  description:'Ground beef and veggies over rice with soy sauce.',
  ingredients:[{item:'ground beef (80/20)',qty:0.5,unit:'lb',aisle:'Meat'},{item:'white rice',qty:1,unit:'cup dry',aisle:'Pantry'},{item:'frozen stir fry vegetables',qty:2,unit:'cups',aisle:'Frozen'},{item:'soy sauce',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'garlic powder',qty:1,unit:'tsp',aisle:'Pantry'},{item:'olive oil',qty:1,unit:'tbsp',aisle:'Pantry'}],
  steps:['Rice: 1 cup + 2 cups water, boil then LOW 18 min.','Brown beef 5-6 min. Drain. Push aside, add oil and frozen veggies 4-5 min.','Mix everything. Add soy sauce and garlic powder. Serve over rice.']},
],
dinner: [
{ id:'d1', name:'Baked Chicken Thighs + Mashed Potatoes + Broccoli', cal:880, protein:52, cookTime:'40 min', difficulty:'Easy', grabAndGo:false,
  description:'Complete comfort dinner. Chicken thighs are almost impossible to overcook.',
  ingredients:[{item:'bone-in chicken thighs',qty:3,unit:'whole',aisle:'Meat'},{item:'russet potatoes',qty:2,unit:'large',aisle:'Produce'},{item:'broccoli florets',qty:2,unit:'cups',aisle:'Produce'},{item:'butter',qty:3,unit:'tbsp',aisle:'Dairy & Eggs'},{item:'whole milk',qty:0.5,unit:'cup',aisle:'Dairy & Eggs'},{item:'olive oil',qty:1,unit:'tbsp',aisle:'Pantry'},{item:'garlic powder',qty:1,unit:'tsp',aisle:'Pantry'},{item:'paprika',qty:1,unit:'tsp',aisle:'Pantry'}],
  steps:['Preheat 425°F. Pat chicken dry. Foil-lined sheet. Season with oil, garlic, paprika, salt, pepper. WASH HANDS.','Bake 35-40 min until golden crispy.','While baking: peel and cube potatoes. Cover with salted water. Boil, then MEDIUM 12-15 min until fork-tender. Drain ALL water. Add 2 tbsp butter and milk. Mash smooth.','Broccoli: microwave-safe bowl + 2 tbsp water, cover, microwave 3-4 min. Add 1 tbsp butter.','Plate: chicken, mashed potatoes, broccoli.']},
{ id:'d2', name:'Beef Pasta with Mixed Veggies', cal:830, protein:42, cookTime:'25 min', difficulty:'Easy', grabAndGo:false,
  description:'Hearty ground beef pasta with marinara.',
  ingredients:[{item:'penne pasta',qty:3,unit:'oz dry',aisle:'Pantry'},{item:'ground beef (80/20)',qty:0.5,unit:'lb',aisle:'Meat'},{item:'marinara sauce',qty:1,unit:'cup',aisle:'Pantry'},{item:'frozen mixed vegetables',qty:1,unit:'cup',aisle:'Frozen'},{item:'shredded mozzarella',qty:0.33,unit:'cup',aisle:'Dairy & Eggs'},{item:'garlic powder',qty:1,unit:'tsp',aisle:'Pantry'}],
  steps:['Boil salted water. Add pasta per box directions.','Brown beef 5-6 min. Drain. Add frozen veggies 3-4 min. Add marinara and garlic. Simmer LOW.','Drain pasta. Add to meat sauce. Stir. Cheese on top, lid on 1 min.']},
{ id:'d3', name:'Easy Chicken Fried Rice', cal:770, protein:40, cookTime:'20 min', difficulty:'Easy', grabAndGo:false,
  description:'Better than takeout. Best with day-old rice.',
  ingredients:[{item:'chicken breast',qty:8,unit:'oz',aisle:'Meat'},{item:'white rice',qty:1,unit:'cup dry',aisle:'Pantry'},{item:'large eggs',qty:2,unit:'whole',aisle:'Dairy & Eggs'},{item:'frozen peas and carrots',qty:1,unit:'cup',aisle:'Frozen'},{item:'soy sauce',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'sesame oil',qty:1,unit:'tsp',aisle:'Pantry'},{item:'olive oil',qty:2,unit:'tbsp',aisle:'Pantry'}],
  steps:['Cook rice (or use cold leftover — fries better).','Dice chicken small. Season. HIGH heat + 1 tbsp oil. Sear 2-3 min, cook 2-3 more. Remove.','Same pan: 1 tbsp oil, frozen veggies 2-3 min. Push aside, crack 2 eggs, scramble, mix with veggies.','Add rice, press flat for crispy bits 2-3 min. Add chicken back. Soy sauce + sesame oil.']},
{ id:'d4', name:'One-Pan Beef & Potato Skillet', cal:820, protein:44, cookTime:'25 min', difficulty:'Easy', grabAndGo:false,
  description:'Everything in one pan. Beef with crispy potato chunks.',
  ingredients:[{item:'ground beef (80/20)',qty:0.75,unit:'lb',aisle:'Meat'},{item:'russet potatoes',qty:2,unit:'medium',aisle:'Produce'},{item:'yellow onion',qty:0.5,unit:'whole',aisle:'Produce'},{item:'shredded cheddar',qty:0.5,unit:'cup',aisle:'Dairy & Eggs'},{item:'olive oil',qty:2,unit:'tbsp',aisle:'Pantry'},{item:'garlic powder',qty:1,unit:'tsp',aisle:'Pantry'},{item:'paprika',qty:1,unit:'tsp',aisle:'Pantry'}],
  steps:['Cube potatoes thumbnail-size. Dice half onion.','MEDIUM-HIGH with oil. Potatoes single layer — don\'t stir 3-4 min for crust. Stir, repeat. 10-12 min total.','Add onion 2-3 min. Push to sides. Beef in center, crumble 5-6 min.','Mix. Add garlic, paprika, salt, pepper. Cheese on top, lid 1-2 min.']},
{ id:'d5', name:'Sheet Pan Chicken + Roasted Potatoes + Green Beans', cal:780, protein:48, cookTime:'35 min', difficulty:'Easy', grabAndGo:false,
  description:'One pan in the oven. Minimal cleanup.',
  ingredients:[{item:'chicken drumsticks',qty:4,unit:'whole',aisle:'Meat'},{item:'baby red potatoes',qty:1,unit:'lb',aisle:'Produce'},{item:'green beans',qty:2,unit:'cups',aisle:'Produce'},{item:'olive oil',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'garlic powder',qty:1,unit:'tsp',aisle:'Pantry'},{item:'Italian seasoning',qty:1,unit:'tsp',aisle:'Pantry'}],
  steps:['Preheat 425°F. Halve potatoes. Toss potatoes + green beans with 2 tbsp oil and half seasoning.','Spread veggies on foil-lined sheet toward edges. Season drumsticks with remaining oil/seasonings. Place in center.','Bake 30-35 min until golden crispy. Cool 3-4 min.']},
{ id:'d6', name:'Sloppy Joes + Potato Wedges', cal:870, protein:40, cookTime:'30 min', difficulty:'Easy', grabAndGo:false,
  description:'Saucy beef on a bun with homemade potato wedges.',
  ingredients:[{item:'ground beef (80/20)',qty:0.75,unit:'lb',aisle:'Meat'},{item:'hamburger buns',qty:2,unit:'whole',aisle:'Bread & Bakery'},{item:'ketchup',qty:3,unit:'tbsp',aisle:'Pantry'},{item:'brown sugar',qty:1,unit:'tbsp',aisle:'Pantry'},{item:'Worcestershire sauce',qty:1,unit:'tbsp',aisle:'Pantry'},{item:'russet potatoes',qty:2,unit:'large',aisle:'Produce'},{item:'olive oil',qty:2,unit:'tbsp',aisle:'Pantry'}],
  steps:['Preheat 425°F. Cut potatoes into wedges. Toss with oil, garlic powder, salt. Foil-lined sheet.','Bake 25-30 min, flip halfway.','Brown beef 5-6 min. Drain. LOW + ketchup, brown sugar, Worcestershire. Simmer 5-10 min.','Toast buns. Spoon mixture on. Serve with wedges.']},
{ id:'d7', name:'Beef & Rice Stuffed Peppers', cal:740, protein:42, cookTime:'45 min', difficulty:'Medium', grabAndGo:false,
  description:'Bell peppers stuffed with seasoned beef and rice, topped with cheese.',
  ingredients:[{item:'bell peppers',qty:3,unit:'large',aisle:'Produce'},{item:'ground beef (80/20)',qty:0.5,unit:'lb',aisle:'Meat'},{item:'white rice',qty:0.5,unit:'cup dry',aisle:'Pantry'},{item:'marinara sauce',qty:1,unit:'cup',aisle:'Pantry'},{item:'shredded mozzarella',qty:0.5,unit:'cup',aisle:'Dairy & Eggs'},{item:'garlic powder',qty:1,unit:'tsp',aisle:'Pantry'},{item:'Italian seasoning',qty:1,unit:'tsp',aisle:'Pantry'}],
  steps:['Preheat 375°F. Cook rice (1/2 cup + 1 cup water). Brown beef, drain.','Cut tops off peppers, remove seeds. Stand in baking dish.','Mix rice, beef, 3/4 cup marinara, seasonings. Stuff into peppers. Pour remaining marinara on top. Cover with foil.','Bake covered 25 min. Remove foil, add mozzarella, bake 10 more. Cool 5 min.']},
],
snacks: [
{ id:'s1', name:'PB&J Sandwich', cal:420, protein:14, cookTime:'2 min', difficulty:'No Cook', grabAndGo:true,
  description:'The reliable calorie-loader.',
  ingredients:[{item:'whole wheat bread',qty:2,unit:'slices',aisle:'Bread & Bakery'},{item:'peanut butter',qty:2,unit:'tbsp',aisle:'Pantry'},{item:'grape jelly',qty:1.5,unit:'tbsp',aisle:'Pantry'}],
  steps:['PB on one slice, jelly on the other. Press together. Eat.']},
{ id:'s2', name:'Trail Mix + Banana', cal:420, protein:12, cookTime:'1 min', difficulty:'No Cook', grabAndGo:true,
  description:'Calorie-dense nuts and dried fruit with a banana.',
  ingredients:[{item:'trail mix',qty:0.5,unit:'cup',aisle:'Pantry'},{item:'banana',qty:1,unit:'whole',aisle:'Produce'}],
  steps:['Pour trail mix into bag. Peel banana. Eat both.']},
{ id:'s3', name:'PB Banana Smoothie', cal:480, protein:28, cookTime:'3 min', difficulty:'No Cook', grabAndGo:true,
  description:'Thick high-calorie smoothie. Tastes like a milkshake.',
  ingredients:[{item:'whole milk',qty:1.5,unit:'cups',aisle:'Dairy & Eggs'},{item:'peanut butter',qty:2,unit:'tbsp',aisle:'Pantry'},{item:'banana',qty:1,unit:'whole',aisle:'Produce'},{item:'honey',qty:1,unit:'tbsp',aisle:'Pantry'},{item:'Greek yogurt',qty:0.5,unit:'cup',aisle:'Dairy & Eggs'}],
  steps:['All ingredients in blender. Blend 30 sec. Pour and drink.']},
{ id:'s4', name:'Cheese, Crackers & Fruit', cal:380, protein:18, cookTime:'2 min', difficulty:'No Cook', grabAndGo:true,
  description:'A no-brainer snack plate.',
  ingredients:[{item:'string cheese',qty:2,unit:'sticks',aisle:'Dairy & Eggs'},{item:'crackers',qty:15,unit:'crackers',aisle:'Pantry'},{item:'apple',qty:1,unit:'whole',aisle:'Produce'}],
  steps:['Crackers on plate. Unwrap cheese. Wash and slice apple. Eat.']},
{ id:'s5', name:'Greek Yogurt + Honey + Granola', cal:370, protein:22, cookTime:'2 min', difficulty:'No Cook', grabAndGo:true,
  description:'Quick protein-packed snack.',
  ingredients:[{item:'Greek yogurt',qty:1,unit:'cup',aisle:'Dairy & Eggs'},{item:'granola',qty:0.5,unit:'cup',aisle:'Pantry'},{item:'honey',qty:1,unit:'tbsp',aisle:'Pantry'}],
  steps:['Yogurt in bowl. Top with granola and honey.']},
{ id:'s6', name:'Apple Slices + Peanut Butter', cal:360, protein:10, cookTime:'2 min', difficulty:'No Cook', grabAndGo:true,
  description:'Sweet, crunchy, satisfying.',
  ingredients:[{item:'apple',qty:1,unit:'large',aisle:'Produce'},{item:'peanut butter',qty:3,unit:'tbsp',aisle:'Pantry'}],
  steps:['Wash apple. Cut into slices around core. Dip in peanut butter.']},
{ id:'s7', name:'Chocolate Milk + Mixed Nuts', cal:430, protein:20, cookTime:'1 min', difficulty:'No Cook', grabAndGo:true,
  description:'Chocolate milk is a legit recovery drink. Nuts add healthy fats.',
  ingredients:[{item:'chocolate milk',qty:2,unit:'cups',aisle:'Dairy & Eggs'},{item:'mixed nuts',qty:0.33,unit:'cup',aisle:'Pantry'}],
  steps:['Pour chocolate milk. Grab handful of nuts. Chocolate milk post-PT is backed by research.']},
],
};

export const SUPPLEMENTS = [
  { name:'Vitamin C', dose:'500mg', timing:'Morning with breakfast', why:'Directly supports collagen synthesis — the main protein in your ACL graft.', icon:'🍊' },
  { name:'Vitamin D3', dose:'2000 IU', timing:'Morning with food', why:'Critical for bone health, immune function, and calcium absorption around the graft site.', icon:'☀️' },
  { name:'Collagen Peptides', dose:'15-20g', timing:'30-60 min before PT/training', why:'Research shows collagen before exercise increases collagen synthesis in tendons and ligaments.', icon:'🧬' },
  { name:'Creatine Monohydrate', dose:'5g daily', timing:'Any time, with food', why:'Most studied sports supplement. Safe for teens. Builds muscle, improves strength.', icon:'💪' },
  { name:'Calcium', dose:'500mg if needed', timing:'With dinner', why:'Supplement if you skip dairy some days. Works with Vitamin D.', icon:'🦴' },
  { name:'Omega-3 Fish Oil', dose:'1000-2000mg', timing:'With any meal', why:'Anti-inflammatory support for recovering knee. Also good for brain health.', icon:'🐟' },
];

// Helpers
export function getMealById(id) {
  for (const cat of Object.values(MEALS)) {
    const found = cat.find(m => m.id === id);
    if (found) return found;
  }
  return null;
}

export function getCategoryForSlot(slot) {
  if (slot === 'breakfast') return 'breakfast';
  if (slot === 'lunch') return 'lunch';
  if (slot === 'dinner') return 'dinner';
  return 'snacks';
}

export function formatQty(n) {
  if (n === 0.25) return '¼';
  if (n === 0.33) return '⅓';
  if (n === 0.5) return '½';
  if (n === 0.75) return '¾';
  if (n === 1.5) return '1½';
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(1);
}
