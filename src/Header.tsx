import React, {useState} from 'react';
import {
  Button,
  Flex,
  FormControl,
  Heading,
  HStack,
  Input,
  KeyboardAvoidingView,
  Modal,
  SimpleGrid,
  useDisclose,
  VStack,
} from 'native-base';
import {ColorSchemeType} from 'native-base/lib/typescript/components/types';

const colors: ColorSchemeType[] = [
  'rose',
  'pink',
  'fuchsia',
  'purple',
  'violet',
  'indigo',
  'blue',
  'lightBlue',
  'darkBlue',
  'cyan',
  'teal',
  'emerald',
  'green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'red',
];

export const Header = ({
  onAdd,
}: {
  onAdd: (x: {player: string; color: string}) => void;
}) => {
  const [newplayer, setNewPlayer] = useState('');
  const [playerColor, setPlayerColor] = useState<string>();
  const modalState = useDisclose();

  return (
    <Flex
      flexDirection={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      mb={5}>
      <Heading letterSpacing={1} size={'3xl'}>
        Desafígado 2022
      </Heading>
      <HStack space={5}>
        <Button
          onPress={modalState.onOpen}
          size={'lg'}
          colorScheme={'blue'}
          variant={'ghost'}>
          Add Player
        </Button>
      </HStack>
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => {
          modalState.onClose();
          setNewPlayer('');
          setPlayerColor(undefined);
        }}>
        <KeyboardAvoidingView
          behavior={'position'}
          minWidth={'100%'}
          pb={10}
          alignItems={'center'}>
          <Modal.Content>
            <Modal.Body>
              <Heading mb={5}>Add Player</Heading>
              <VStack space={5}>
                <FormControl>
                  <HStack justifyContent={'space-between'}>
                    <FormControl.Label>Player Name</FormControl.Label>
                  </HStack>
                  <Input value={newplayer} onChangeText={setNewPlayer} />
                </FormControl>
                <FormControl>
                  <HStack justifyContent={'space-between'}>
                    <FormControl.Label>Color</FormControl.Label>
                  </HStack>
                  <SimpleGrid columns={7} space={3}>
                    {colors.map(color => (
                      <Button
                        key={color as string}
                        colorScheme={color}
                        opacity={playerColor === color ? 1 : 0.5}
                        onPress={() => setPlayerColor(color as string)}
                        w={10}
                        h={10}>
                        {playerColor === color ? '✓' : ''}
                      </Button>
                    ))}
                  </SimpleGrid>
                </FormControl>
                <Button
                  colorScheme={'blue'}
                  onPress={() => {
                    onAdd({player: newplayer, color: playerColor!});
                    setNewPlayer('');
                    setPlayerColor(undefined);
                    modalState.onClose();
                  }}
                  mt={10}
                  isDisabled={!newplayer || !playerColor}>
                  Add Player
                </Button>
              </VStack>
            </Modal.Body>
          </Modal.Content>
        </KeyboardAvoidingView>
      </Modal>
    </Flex>
  );
};
