import { createContext, useState, useEffect, useContext, useReducer, act } from "react";

const BASE_URL = 'http://localhost:9000';

const citiesContext = createContext();

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: "",
}

function reducer(state, action){
    switch(action.type){
        case 'loading':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'city/loaded':
            return {
                ...state,
                isLoading: false,
                currentCity: action.payload
            };
        case 'cities/loaded':
            return {
                ...state,
                isLoading: false,
                cities: action.payload
            };
        case 'cities/create':
            return {
                ...state, 
                isLoading: false,
                cities: [...state.cities, action.payload],
                currentCity: action.payload,
            };
        case 'cities/delete':
            return {
                ...state,
                isLoading: false,
                cities: state.cities.filter((city) => city.id !== action.payload),
                currentCity: {}
            };
        case 'rejected':
            return {
                ...state,
                isLoading: false,
                error: action.payload
            };
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }

}
function CitiesProvider({ children }) {
    const [{cities, isLoading, currentCity, error}, dispatch] = useReducer(reducer, initialState);
    // const [cities, setCities] = useState([])
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});

    useEffect( function(){
        async function fetchCities(){
            dispatch({ type: 'loading'});
            try{
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                // console.log(data);
                // setCities(data);
                dispatch({ type: 'cities/loaded', payload: data });
            }catch{
                // console.log('there was an error loading data')
                dispatch({ type: 'rejected', payload: 'There was an error cities  data' });
            }
        }
        fetchCities();
    }, [])


    async function getCity(id){
        if (currentCity?.id === Number(id)) return;
        dispatch({ type: 'loading'});
        try{
            
            const res = await fetch(`${BASE_URL}/cities/${id}`);
            const data = await res.json();
            dispatch({ type: 'city/loaded', payload: data })
        }catch{
            dispatch({ type: 'rejected', payload: 'There was an error city data' });
        }
    }

    async function createCity( newCity ){
        dispatch({ type: 'loading'});
        try{
            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            );
            const data = await res.json();
            // console.log(data);
            // setCities((cities) => [...cities, data]);
            dispatch({ type: 'cities/create', payload: data });
        }catch{
            dispatch({ type: 'rejected', payload: 'There was an error creating city data' });
        }
    }

    async function deleteCity( id ){
        dispatch({ type: 'loading'});
        try{
            
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE',
            });
            // console.log(data);
            // setCities((cities) => cities.filter((city) =>city.id !== id));
            dispatch({ type: 'cities/delete', payload: id });
        }catch{
            dispatch({ type: 'rejected', payload: 'There was an error deleting city data' })
        }
    }

    return (
        <citiesContext.Provider value={{cities, isLoading, currentCity, error,  getCity, createCity, deleteCity }}>
        {children}
        </citiesContext.Provider> 
    )

}


function useCities(){ 
    const context =  useContext(citiesContext);
    if(context === undefined){
        throw new Error('useCities must be used within a CitiesProvider')
    }
    return context;
}

export { CitiesProvider, useCities }; 