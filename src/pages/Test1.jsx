import React from 'react'
import {  useListClientsQuery } from '../services/api/clientApi';

const Test1 = () => {

    const { data, isLoading, isError, refetch } = useListClientsQuery();

    const Listclients = data?.items || [];
  return (
    <div>
      <p>{JSON.stringify(Listclients)}</p>
    </div>
  )
}

export default Test1