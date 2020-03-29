import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { View, FlatList, Text, Image, TouchableOpacity } from 'react-native';

import logoImg from '../../assets/logo.png';

import api from '../../services/api';

import styles from './style';

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(-1);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  
  function navigationToDetail(incident){
    navigation.navigate('Detail', { incident });
  }

  async function loadIncidents(){
    if (loading){
      return;
    }
    //console.log(incidents.length);
    if(page > 0 && incidents.length === total){
      return;
    }

    setLoading(true);

    const response = await api.get('incident', 
    {
      params: {page}
    });

    setTotal(response.headers['x-total-count']);
    //console.log(response.data);
    setIncidents([ ... incidents ,... response.data]);
    setPage(page + 1);
    setLoading(false);
  }

  useEffect(() => {
    loadIncidents();
    }, []
  );

  return (
    <View style={styles.container} > 
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText} >
          Total de <Text style={styles.headerHold}>{total} Casos</Text>
        </Text>
      </View>
      <Text style={styles.title}>Bem-Vindo</Text>
      <Text style={styles.decription}>Escolha um dos casos abaixo e salve o dia.</Text>

      <FlatList
        data={incidents}
        style={styles.incidentList}
        keyExtractor={incident => String(incident.id)}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident}) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>Caso:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>Valor:</Text>
            <Text style={styles.incidentValue}>
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency', 
                  currency: 'BRL'})
                  .format(incident.value)}
            </Text>


            <TouchableOpacity style={styles.detailsButton}
              onPress={() => navigationToDetail(incident)} >
                <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                <Feather name="arrow-right" size={16} color="#E02041" />
              </TouchableOpacity>
          </View>
        )}
      />



     
    </View>
  );
}

