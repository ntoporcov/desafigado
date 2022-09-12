import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  extendTheme,
  Flex,
  Heading,
  HStack,
  Input,
  KeyboardAvoidingView,
  Modal,
  NativeBaseProvider,
  Pressable,
  ScrollView,
  useDisclose,
  VStack,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Header} from './Header';
import PlayerCard from './PlayerCard';
import Chart from './Chart';
import {ColorSchemeType} from 'native-base/lib/typescript/components/types';

const Sound = require('react-native-sound');
Sound.setCategory('Playback');

const presetSounds = [
  {
    amount: 1,
    sound: new Sound('./sounds/toco_y_me_voy.mp3', Sound.MAIN_BUNDLE),
  },
  {
    amount: 4,
    sound: new Sound('./sounds/e_tetra.mp3', Sound.MAIN_BUNDLE),
  },
  {
    amount: 5,
    sound: new Sound('./sounds/e_penta.mp3', Sound.MAIN_BUNDLE),
  },
  {
    amount: 8,
    sound: new Sound('./sounds/quem_e_q_sobe.mp3', Sound.MAIN_BUNDLE),
  },
  {
    amount: 10,
    sound: new Sound('./sounds/garotao.mp3', Sound.MAIN_BUNDLE),
  },
  {
    amount: 15,
    sound: new Sound('./sounds/hajacoracao.mp3', Sound.MAIN_BUNDLE),
  },
  {
    amount: 20,
    sound: new Sound(
      './sounds/essa_vou_te_contar_amigo_q_sufoco.mp3',
      Sound.MAIN_BUNDLE,
    ),
  },
];

// Define the config
const config = {
  useSystemColorMode: true,
};

const customTheme = extendTheme({config});

export type player = {
  name: string;
  amount: number;
  color: ColorSchemeType;
  activity: number[];
};

const initialData = {players: {}, total: 82, stored: false};

const App = () => {
  const [data, setData] = useState<{
    players: {[i: string]: player};
    total: number;
    stored: boolean;
  }>(initialData);

  const kegTotalDisclosure = useDisclose();
  const [kegTotal, setKegTotal] = useState('');

  useEffect(() => {
    if (!data.stored) {
      AsyncStorage.getItem('data').then(res => {
        if (res) {
          setData({...JSON.parse(res), stored: true});
        }
      });
      return;
    }

    AsyncStorage.setItem('data', JSON.stringify(data));
  }, [data]);

  const resetCount = () => {
    setData(curr => ({
      ...curr,
      players: {},
    }));
  };

  const upPlayersCount = (name: string) => {
    const newAmount = data.players[name].amount + 1;

    const soundToPlay = presetSounds.find(sound => sound.amount === newAmount);

    if (soundToPlay) {
      soundToPlay.sound.play();
    }

    const now = new Date(),
      then = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
      ),
      msSinceMidnight = now.getTime() - then.getTime();

    setData(curr => ({
      ...curr,
      players: {
        ...curr.players,
        [name]: {
          ...curr.players[name],
          amount: newAmount,
          activity: [...curr.players[name].activity, msSinceMidnight],
        },
      },
    }));
  };

  const updateKegTotal = () => {
    setData(curr => ({
      ...curr,
      total: parseInt(kegTotal),
    }));
  };

  const playersCountTotal = Object.values(data.players).reduce(
    (previousValue, currentValue) => {
      return previousValue + currentValue.amount;
    },
    0,
  );

  return (
    <NativeBaseProvider theme={customTheme}>
      <Box p={5}>
        <Header
          onReset={resetCount}
          onAdd={({player, color}) =>
            setData(curr => ({
              ...curr,
              players: {
                ...curr.players,
                [player]: {
                  name: player,
                  amount: 0,
                  color: color,
                  activity: [],
                },
              },
            }))
          }
        />
        <HStack space={5} w={'100%'} h={'100%'}>
          <ScrollView flex={1} pt={'10px'}>
            <VStack
              flex={1}
              justifyContent={'space-between'}
              height={'80%'}
              overflow={'visible'}>
              <Flex flexDirection={'row'} flexWrap={'wrap'}>
                {Object.values(data?.players || []).length === 0 && (
                  <Heading opacity={0.3}>Start By Adding Players</Heading>
                )}
                {Object.values(data?.players || []).map((player, index) => (
                  <PlayerCard
                    key={index}
                    name={player.name}
                    color={player.color}
                    amount={player.amount}
                    onTap={() => upPlayersCount(player.name)}
                  />
                ))}
              </Flex>
              <Box h={'500px'}>
                {data.stored && Object.values(data.players).length > 0 && (
                  <Chart data={data} />
                )}
              </Box>
            </VStack>
          </ScrollView>
          <Flex alignItems={'center'} maxW={40} px={4}>
            <Pressable
              onLongPress={kegTotalDisclosure.onOpen}
              delayLongPress={3000}>
              <Heading size={'sm'}>Amount Left</Heading>
              <Heading size={'2xl'} textAlign={'center'}>
                {data.total - playersCountTotal}
              </Heading>
            </Pressable>
            <Modal {...kegTotalDisclosure}>
              <KeyboardAvoidingView
                behavior={'position'}
                minWidth={'100%'}
                pb={16}
                alignItems={'center'}>
                <Modal.Content minWidth={'300px'}>
                  <Modal.Body>
                    <Heading mb={5}>Enter Total</Heading>
                    <Input
                      value={kegTotal}
                      onChangeText={setKegTotal}
                      keyboardType={'number-pad'}
                    />
                    <Button
                      onPress={updateKegTotal}
                      colorScheme={'blue'}
                      mt={6}>
                      Save Keg Amount
                    </Button>
                  </Modal.Body>
                </Modal.Content>
              </KeyboardAvoidingView>
            </Modal>
            <Flex
              justifyContent={'flex-end'}
              h={'70%'}
              mt={3}
              rounded={'xl'}
              overflow={'hidden'}
              bgColor={'gray.200'}>
              <Box
                h={((data.total - playersCountTotal) / data.total) * 100 + '%'}
                w={20}
                bgColor={'yellow.400'}
              />
            </Flex>
          </Flex>
        </HStack>
      </Box>
    </NativeBaseProvider>
  );
};

export default App;
