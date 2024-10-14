import React, { useState } from 'react';
import Video from './Video';

function Home() {
  const [isFilled, setIsFilled] = useState(false); 
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const handleForm = (e) => {
    const { name, value } = e.target; // Destructure name and value from the input
    setForm((prev) => ({
      ...prev,  // Keep previous state
      [name]: value,  // Update the specific field
    }));
  };

  const handleClick = () => {
    if (form.name && form.email) {
      setIsFilled(true);
    } else {
      alert("Fill all details!!!");
    }
  };

  return (
    <>      
      {!isFilled ? (
        <>
          <div>
            <label htmlFor='name'>Name</label>
            <input 
              value={form.name} 
              onChange={handleForm} 
              name="name" 
              id="name" 
              placeholder='Enter name'
            />

            <label htmlFor='email'>Email</label>
            <input 
              value={form.email} 
              onChange={handleForm} 
              name="email" 
              id="email" 
              placeholder='Enter email'
            />
          </div>
          <button onClick={handleClick}>Join Server</button>
        </>
      ) : (
        <Video form={form} />  
      )}
    </>
  );
}

export default Home;
