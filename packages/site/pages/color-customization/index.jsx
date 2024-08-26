import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import axios from 'axios';
import BlockchainContext from '../../state/BlockchainContext';
import { getSmartAccountAddress } from '../../src/blockchain/useAccountAbstractionPayment';
import { ChevronDoubleLeftIcon } from '@heroicons/react/24/solid';
import { TextLink } from '../../src/ui-components/text';
import useCreateUser from '../../src/hooks/useCreateUser';
import { Button } from '../../src/ui-components/button';

let url = process.env.NEXT_PUBLIC_FABSTIRDB_BACKEND_URL || '';

const darkThemeColor = [
  { label: 'Dark Gray', value: '#333333' },
  { label: 'Charcoal', value: '#2C2C2C' },
  { label: 'Slate Gray', value: '#6C757D' },
  { label: 'Gunmetal', value: '#2A2A2A' },
  { label: 'Ash Gray', value: '#B2B2B2' },
  { label: 'Midnight Blue', value: '#003366' },
  { label: 'Deep Blue', value: '#003366' },
  { label: 'Ocean Blue', value: '#004080' },
  { label: 'Dark Purple', value: '#2E003E' },
  { label: 'Indigo', value: '#4B0082' },
  { label: 'Forest Green', value: '#228B22' },
  { label: 'Deep Green', value: '#004d00' },
  { label: 'Crimson Red', value: '#DC143C' },
  { label: 'Firebrick', value: '#B22222' },
  { label: 'Burnt Orange', value: '#CC5500' },
  { label: 'Golden Rod', value: '#DAA520' },
  { label: 'Dark Olive Green', value: '#556B2F' },
  { label: 'Steel Blue', value: '#4682B4' },
  { label: 'Dark Salmon', value: '#E9967A' },
  { label: 'Rosy Brown', value: '#BC8F8F' },
];
const lightThemeColor = [
  { label: 'White', value: '#FFFFFF' },
  { label: 'Light Gray', value: '#F0F0F0' },
  { label: 'Gainsboro', value: '#DCDCDC' },
  { label: 'Silver', value: '#C0C0C0' },
  { label: 'Light Slate Gray', value: '#778899' },
  { label: 'Sky Blue', value: '#87CEEB' },
  { label: 'Powder Blue', value: '#B0E0E6' },
  { label: 'Alice Blue', value: '#F0F8FF' },
  { label: 'Lavender', value: '#E6E6FA' },
  { label: 'Light Pink', value: '#FFB6C1' },
  { label: 'Peach Puff', value: '#FFDAB9' },
  { label: 'Misty Rose', value: '#FFE4E1' },
  { label: 'Honeydew', value: '#F0FFF0' },
  { label: 'Pale Goldenrod', value: '#EEE8AA' },
  { label: 'Light Green', value: '#90EE90' },
  { label: 'Light Coral', value: '#F08080' },
  { label: 'Coral', value: '#FF7F50' },
  { label: 'Turquoise', value: '#40E0D0' },
  { label: 'Light Sea Green', value: '#20B2AA' },
  { label: 'Khaki', value: '#F0E68C' },
];

const ColorCustomization = () => {
  const router = useRouter();
  const [smartAccountAddress, setSmartAccountAddress] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // Track the selected mode (dark or light)
  const [colors, setColors] = useState({
    textColor: '#000000', // Default values for light mode
    buttonColor: '#000000',
    backgroundColor: '#ffffff',
    darkTextColor: '#E0E0E0', // Default values for dark mode
    darkButtonColor: '#BB86FC',
    darkBackgroundColor: '#121212',
  });
  const blockchainContext = useContext(BlockchainContext);
  const { smartAccount, setSmartAccount, setConnectedChainId } =
    blockchainContext;
  const { signOut } = useCreateUser();

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
      if (error.response.data.err == 'Invalid token.') {
        handleLogout();
      }
      if (error.response) {
        console.error('Error fetching colors:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
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
    defaultValues: colors,
  });

  useEffect(() => {
    setValue('textColor', colors.textColor);
    setValue('buttonColor', colors.buttonColor);
    setValue('backgroundColor', colors.backgroundColor);

    setValue('darkTextColor', colors.darkTextColor);
    setValue('darkButtonColor', colors.darkButtonColor);
    setValue('darkBackgroundColor', colors.darkBackgroundColor);
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
        console.log('smartAccountAddress', smartAccountAddress);
        fetchColor();
      }
    } catch (error) {
      if (error?.response?.data?.err === 'Invalid token.') {
        handleLogout();
      }
      if (error.response) {
        console.error('Error saving colors:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      // throw error;
    }
  };

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--button-color',
      colors?.buttonColor,
    );
    document.documentElement.style.setProperty(
      '--background-color',
      colors?.backgroundColor,
    );
    document.documentElement.style.setProperty(
      '--text-color',
      colors?.textColor,
    );
    document.documentElement.style.setProperty(
      '--dark-button-color',
      colors?.darkButtonColor,
    );
    document.documentElement.style.setProperty(
      '--dark-background-color',
      colors?.darkBackgroundColor,
    );
    document.documentElement.style.setProperty(
      '--dark-text-color',
      colors?.darkTextColor,
    );
  }, [colors]);

  async function handleLogout() {
    await signOut();
    setSmartAccount(null);
    setConnectedChainId(null);
    router.push('/');
  }

  return (
    <React.Fragment>
      <div className="flex justify-start ml-4">
        <TextLink className="mt-6" href="/">
          <div className="flex items-center">
            <ChevronDoubleLeftIcon
              className="h-6 w-6 font-bold text-gray-500 lg:h-8 lg:w-8 mr-2"
              aria-hidden="true"
            />
            <span className="text-text dark:text-dark-text">Back to Root</span>
          </div>
        </TextLink>
      </div>
      <div className="max-w-lg mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-text dark:text-dark-text">
          Color Customization
        </h1>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsDarkMode(false)}
            className={`px-4 py-2 font-semibold rounded-md ${
              !isDarkMode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
          >
            Light Mode
          </button>
          <button
            onClick={() => setIsDarkMode(true)}
            className={`px-4 py-2 font-semibold rounded-md ml-2 ${
              isDarkMode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-800'
            }`}
          >
            Dark Mode
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {isDarkMode ? (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-text dark:text-dark-text">
                  Dark Mode Text Color
                </label>
                <select
                  className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                  {...register('darkTextColor', { required: true })}
                >
                  {darkThemeColor.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {errors.darkTextColor && (
                  <p className="text-red-500 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-text dark:text-dark-text">
                  Dark Mode Button Color
                </label>
                <select
                  className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                  {...register('darkButtonColor', { required: true })}
                >
                  {darkThemeColor.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {errors.darkButtonColor && (
                  <p className="text-red-500 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-text dark:text-dark-text">
                  Dark Mode Background Color
                </label>
                <select
                  className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                  {...register('darkBackgroundColor', { required: true })}
                >
                  {darkThemeColor.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {errors.darkBackgroundColor && (
                  <p className="text-red-500 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-text dark:text-dark-text">
                  Light Mode Text Color
                </label>
                <select
                  className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                  {...register('textColor', { required: true })}
                >
                  {lightThemeColor.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {errors.textColor && (
                  <p className="text-red-500 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-text dark:text-dark-text">
                  Light Mode Button Color
                </label>
                <select
                  className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                  {...register('buttonColor', { required: true })}
                >
                  {lightThemeColor.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {errors.buttonColor && (
                  <p className="text-red-500 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-semibold mb-2 text-text dark:text-dark-text">
                  Light Mode Background Color
                </label>
                <select
                  className="w-full h-10 border rounded-md focus:ring-2 focus:ring-blue-500"
                  {...register('backgroundColor', { required: true })}
                >
                  {lightThemeColor.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                {errors.backgroundColor && (
                  <p className="text-red-500 text-xs mt-1">
                    This field is required
                  </p>
                )}
              </div>
            </>
          )}
          <Button
            type="submit"
            className="w-full py-2 text-white font-semibold rounded-md transition duration-200"
          >
            Save Colors
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default ColorCustomization;
