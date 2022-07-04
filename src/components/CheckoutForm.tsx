import axios from 'axios';
import { useState } from 'react';
import { CartItemType } from './MenuAPI';
import { useNavigate } from "react-router-dom";

//declaring AddProps with onAdd function
type AddProps = {
  onAdd: (name: string, phone: string, cart: string, total: string, date: string) => void;
}


//declaring JSX element
const AddReviewForm = (props: AddProps) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cart = useState(localCart as CartItemType[]);
  const total = localStorage.getItem("total");
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
  var cartList = "";

  cart[0].forEach((food) => {
    cartList += food.food_name + ', ';
  });

  if (cartList.slice(-2) === ', ') {
    cartList = cartList.substring(0, cartList.length - 2);
  }

  //you automatically get event object just like event listeners in js
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setName(e.target.value);
  };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(e);
      setPhone(e.target.value);
    };

  //submits the form and updates the review list, resets the labels to empty
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    //by default it will submit the form, so prevent
    e.preventDefault();
    props.onAdd(name, phone, cartList, total!, date);
    setName('');
    setPhone('');

    let data = {
      name: name,
      phone: phone,
      cart: cartList,
      total: total,
      date: date
    }

      try {
        const response = await axios.post(
          'https://shielded-depths-40144.herokuapp.com/orders', data
        );
        console.log(response.data);

        // Clear cart in local storage
        localStorage.clear();

        // Go to orders page
        navigate("/orders");
      } catch (err) {
        console.log(err);
      }
  };

  return (
    //displaying the form
    <div className="reviews-form">
      <hr />
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Place order</legend>
          <span>Name: </span>
          <input
            type='text'
            value={name}
            onChange={handleNameChange}
            placeholder='Enter Your Name'
            required
          />
          <br />
          <span>Phone Number: </span>
          <input
            type='text'
            value={phone}
            onChange={handlePhoneChange}
            placeholder='Enter Your Phone Number'
            maxLength={10}         
            required
          />
          <input type='hidden' value={cartList} />
          <br /><br />
          <button type="submit">Submit Order</button>
        </fieldset>
        <br /><br />
      </form>
    </div>
  );
};

export default AddReviewForm;