import {
    Box,
    Button,
    Card,
    CardBody,
    Flex,
    FormControl,
    FormHelperText,
    FormLabel,
    Heading,
    Input,
    Stack,
    StackDivider,
    Text,
} from '@chakra-ui/react';
import {
    ActionFunctionArgs,
    redirect,
    type MetaFunction,
} from '@remix-run/node';
import { Form, useLoaderData, useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';
import { prisma } from '~/libs/db';
import { useSocketStore } from '~/store/socket';

export const meta: MetaFunction = () => {
    return [
        { title: '順番待ちリストに登録' },
        { name: 'description', content: '順番待ちリストに登録' },
    ];
};

export const loader = async () => {
    return await prisma.reservation.count();
};
export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const name = formData.get('name');

    if (!name) return null;

    const reservation = await prisma.reservation.create({
        data: { name: name.toString(), date: new Date() },
    });

    return redirect(`/count/${reservation.uuid}`);
};

export default function Index() {
    const count = useLoaderData<typeof loader>();
    const { revalidate } = useRevalidator();
    const socket = useSocketStore((store) => store.socket);

    useEffect(() => {
        socket.on('update', revalidate);
        (window as any).socket = socket;

        return () => {
            socket.off('update', revalidate);
        };
    }, []);

    return (
        <Flex
            width="full"
            align="center"
            justifyContent="center"
            onSubmit={(e) => {
                e.currentTarget.querySelector('button')!.disabled = true;
            }}
        >
            <Box p={2}>
                <Box textAlign="center" p={2}>
                    <Text>
                        令和6年度 掛川西高等学校 文化祭
                        <br />
                        3年6組
                    </Text>
                </Box>
                <Stack divider={<StackDivider />}>
                    <Card colorScheme="teal" bg="teal" color="white">
                        <CardBody p={2}>
                            <Flex direction="row" align="center">
                                <Text>ただいま</Text>
                                <Heading p={2} size="2xl">
                                    {count}
                                </Heading>
                                <Text>組待ち（約</Text>
                                <Heading p={1} size="1xl">
                                    {count * 10}
                                </Heading>
                                <Text>分）</Text>
                            </Flex>
                        </CardBody>
                    </Card>

                    <Form
                        method="post"
                        onSubmit={() => {
                            socket.emit('update');
                        }}
                    >
                        <FormControl isRequired>
                            <FormLabel>グループ名</FormLabel>
                            <Input
                                name="name"
                                autoComplete="off"
                                maxLength={10}
                            />
                            <FormHelperText>10文字以内</FormHelperText>
                        </FormControl>
                        <Button
                            colorScheme="teal"
                            variant="solid"
                            width="full"
                            mt={4}
                            type="submit"
                        >
                            受付開始
                        </Button>
                    </Form>
                </Stack>
            </Box>
        </Flex>
    );
}
