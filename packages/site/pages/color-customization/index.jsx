import React, { useContext, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import BlockchainContext from '../../state/BlockchainContext';
import { getSmartAccountAddress } from '../../src/blockchain/useAccountAbstractionPayment';

let url = process.env.NEXT_PUBLIC_FABSTIRDB_BACKEND_URL || '';

const ColorCustomization = () => {
  const [smartAccountAddress, setSmartAccountAddress] = useState('');
  const [colors, setColors] = useState({
    textColor: '#000000', // Default values
    buttonColor: '#000000',
    backgroundColor: '#ffffff',
  });
  const blockchainContext = useContext(BlockchainContext);
  const { smartAccount } = blockchainContext;

  useEffect(() => {
    if (smartAccountAddress) {
      fetchColor();
    }
  }, [smartAccountAddress]);

  const fetchColor = async () => {
    let userData = sessionStorage.getItem('userSession');
    let token = JSON.parse(userData)?.token ?? '';
    try {
      if (!token || !smartAccountAddress) {
        return;
      }
      const response = await axios.get(`${url}/color/${smartAccountAddress}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setColors(response.data.document[0]);
    } catch (error) {
      // Log detailed error information
      if (error.response) {
        console.error('Error fetching colors:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  };

  useEffect(() => {
    const setSmartAccountAddressFn = async () => {
      if (smartAccount) {
        setSmartAccountAddress(await getSmartAccountAddress(smartAccount));
      }
    };
    setSmartAccountAddressFn();
  }, [smartAccount]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: colors, // Set default values for the form fields
  });

  useEffect(() => {
    setValue('textColor', colors.textColor);
    setValue('buttonColor', colors.buttonColor);
    setValue('backgroundColor', colors.backgroundColor);
  }, [colors, setValue]);

  const onSubmit = async (data) => {
    try {
      data.smartAccount = smartAccountAddress;
      let userData = sessionStorage.getItem('userSession');
      let token = JSON.parse(userData)?.token ?? '';
      const response = await axios.post(`${url}/color`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (smartAccountAddress) {
        fetchColor();
      }
    } catch (error) {
      // Log detailed error information
      if (error.response) {
        console.error('Error saving colors:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--button-color', colors.buttonColor);
    document.documentElement.style.setProperty('--background-color', colors.backgroundColor);
    document.documentElement.style.setProperty('--text-color', colors.textColor);
  }, [colors]);
  
  return (
    <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1
        className="text-2xl font-bold text-center mb-6 text-text"
      >
        Color Customization
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col">
          <label
            className="text-sm font-semibold mb-2 text-text"
          >
            Text Color
          </label>
          <input
            type="color"
            className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
            {...register('textColor', { required: true })}
          />
          {errors.textColor && (
            <p className="text-red-500 text-xs mt-1">This field is required</p>
          )}
        </div>

        <div className="flex flex-col">
          <label
            className="text-sm font-semibold mb-2 text-text"
          >
            Button Color
          </label>
          <input
            type="color"
            className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
            {...register('buttonColor', { required: true })}
          />
          {errors.buttonColor && (
            <p className="text-red-500 text-xs mt-1">This field is required</p>
          )}
        </div>

        <div className="flex flex-col">
          <label
            className="text-sm font-semibold mb-2 text-text"
          >
            Background Color
          </label>
          <input
            type="color"
            className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
            {...register('backgroundColor', { required: true })}
          />
          {errors.backgroundColor && (
            <p className="text-red-500 text-xs mt-1">This field is required</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-button text-white font-semibold rounded-md  transition duration-200"
        >
          Save Colors
        </button>
      </form>
    </div>
  );
};

export default ColorCustomization;
