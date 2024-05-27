import { DeleteIcon } from '@chakra-ui/icons';
import {
    IconButton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { useEffect } from 'react';
import { prisma } from '~/libs/db';
import { useSocketStore } from '~/store/socket';

export const meta: MetaFunction = () => {
    return [
        { title: 'リスト' },
        {
            name: 'description',
            content: 'カウント表示',
        },
    ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const { number } = await request.json();

    await prisma.reservation.delete({ where: { number } });

    console.log('action:', new Date().toString());

    return null;
};
export const loader = async () => {
    return (await prisma.reservation.findMany()).map((reservation) => ({
        ...reservation,
        date: reservation.date.toString(),
    }));
};

export default function List() {
    const list = useLoaderData<typeof loader>();
    const { revalidate } = useRevalidator();
    const socket = useSocketStore((store) => store.socket);

    useEffect(() => {
        socket.on('update', revalidate);

        return () => {
            socket.off('update', revalidate);
        };
    }, []);

    const remove = async (number: number) => {
        await fetch('/list', {
            body: JSON.stringify({ number: number }),
            method: 'POST',
        });
        revalidate();
        socket.emit('update');
    };

    return (
        <VStack>
            <TableContainer width="100%">
                <Table>
                    <Thead>
                        <Tr>
                            <Td>番号</Td>
                            <Td>予約時間</Td>
                            <Td>グループ名</Td>
                            <Td />
                        </Tr>
                    </Thead>
                    <Tbody>
                        {list.map((item) => (
                            <tr key={item.number}>
                                <Td>{item.number}</Td>
                                <Td>{item.date}</Td>
                                <Td>{item.name}</Td>
                                <Td>
                                    <IconButton
                                        type="button"
                                        aria-label="delete"
                                        onClick={(e) => {
                                            e.currentTarget.disabled = true;
                                            remove(item.number);
                                        }}
                                    >
                                        <DeleteIcon color="red" />
                                    </IconButton>
                                </Td>
                            </tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </VStack>
    );
}
