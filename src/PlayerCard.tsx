import React, {useState} from 'react';
import {ColorSchemeType} from 'native-base/lib/typescript/components/types';
import {
  Box,
  Button,
  Card,
  FormControl,
  Heading,
  Pressable,
  Text,
} from 'native-base';

export interface PlayerCardProps {
  name: string;
  amount: number;
  color: ColorSchemeType;
  onTap: () => void;
}

const PlayerCard = (props: PlayerCardProps) => {
  const [hasTapped, setHasTapped] = useState(false);
  const [lastTap, setLastTap] = useState<Date>();

  const tapHandler = () => {
    props.onTap();
    setHasTapped(true);
    setLastTap(new Date());
    setTimeout(() => setHasTapped(false), 10000);
  };

  return (
    <Pressable
      onPress={tapHandler}
      isDisabled={hasTapped}
      _pressed={{opacity: 0.5}}
      shadow={7}
      p={4}
      _light={{bgColor: 'gray.100'}}
      _dark={{bgColor: 'gray.900'}}
      rounded={'lg'}
      minWidth={'300px'}
      flexGrow={2}
      mr={5}
      mb={5}>
      <FormControl>
        <Heading size={'lg'} textAlign={'center'}>
          {props.name}
        </Heading>
        <Heading
          size={'4xl'}
          textAlign={'center'}
          _light={{color: props.color + '.500'}}
          _dark={{color: props.color + '.300'}}>
          {props.amount}
        </Heading>
        <FormControl.HelperText>
          <Text opacity={0.5} textAlign={'center'}>
            Last Tapped: {lastTap?.toLocaleTimeString() || 'N/A'}
          </Text>
        </FormControl.HelperText>
        <Button
          colorScheme={props.color}
          size={'lg'}
          mt={1}
          isDisabled={hasTapped}
          onPress={tapHandler}>
          {hasTapped ? '⏰' : '+1'}
        </Button>
      </FormControl>
    </Pressable>
  );
};

export default PlayerCard;
