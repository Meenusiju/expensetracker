import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore"; 
import { useState } from 'react';
import Graph from './Graph';


function App() {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
            e.preventDefault();
            
            if (name && cost) {
              const item = { 
                name,
                cost 
              };
              addDoc(collection(db, "expenseTracker"), item ).then(res => {
                setName('');
                setCost('');
                setError('');
              });
            }else {
             setError('Please enter values before submitting');
            }
   } 
  return (
    <>
      <header className="indigo darken-1 section">
       <h2 className="center white-text">Expense Tracker</h2>
       <p className="flow-text grey-text center text-lighten-2">Monthly expense tracker</p>
      </header>
      <div class="container section">
       <div class="row">
         <div class="col s12 m6">
           <form className="card z-depth-0" onSubmit={handleSubmit}>
              <div class="card-content">
               <span className="card-title indigo-text">Add expenses:</span>
                <div class="input-field">
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value) }/>
                  <label htmlFor="name" >Cateory</label>
                </div>
                <div class="input-field">
                  <input type="text" id="cost" value={cost} onChange={(e) => setCost(e.target.value) }/>
                  <label htmlFor="cost">Cost</label>
                </div>
                <div class="input-field center">
                   <button class="btn-large pink white-text">Add Item</button>
                </div>
                <div class="input-field center">
                   <p id="error" class="red-text">{error}</p>
                </div>
              </div>
           </form>
         </div>
         <div class="col s12 m5 push-m1">
              <Graph />
         </div>
       </div>
      </div>

  </>
  );
}

export default App;
