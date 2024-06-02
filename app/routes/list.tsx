import { ArrowUpIcon, DeleteIcon } from '@chakra-ui/icons';
import {
    Card,
    CardBody,
    IconButton,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Thead,
    Tr,
    VStack,
} from '@chakra-ui/react';
import { Reservation } from '@prisma/client';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import type { Jsonify } from '@remix-run/server-runtime/dist/jsonify';
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

    switch (request.method) {
        case 'DELETE':
            await prisma.reservation.delete({ where: { number } });

            break;
        case 'PATCH':
            await prisma.reservation.update({
                where: { number },
                data: { keep: new Date() },
            });
            break;
    }

    return null;
};
export const loader = async () => {
    return (await prisma.reservation.findMany()).map((reservation) => ({
        ...reservation,
        date: reservation.date.toISOString(),
    }));
};

export default function List() {
    const [waitingList, keepList] = useLoaderData<typeof loader>().reduce<
        [Jsonify<Reservation[]>, Jsonify<Reservation[]>]
    >(
        (prev, curr) => {
            prev[curr.keep ? 1 : 0].push(curr);

            return prev;
        },
        [[], []],
    );
    const { revalidate } = useRevalidator();
    const socket = useSocketStore((store) => store.socket);

    useEffect(() => {
        socket.on('update', revalidate);
        const intId = setInterval(() => {
            revalidate();
        }, 5000);

        return () => {
            socket.off('update', revalidate);

            clearInterval(intId);
        };
    }, []);

    const remove = async (number: number) => {
        await fetch('/list', {
            body: JSON.stringify({ number: number }),
            method: 'DELETE',
        });
        revalidate();
        socket.emit('update');
    };
    const keep = async (number: number) => {
        await fetch('/list', {
            body: JSON.stringify({ number: number }),
            method: 'PATCH',
        });
        revalidate();
        socket.emit('update');
    };

    return (
        <VStack>
            <Card>
                <CardBody>
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
                                {keepList.map((item) => (
                                    <tr key={item.number}>
                                        <Td>{item.number}</Td>
                                        <Td>{item.date}</Td>
                                        <Td>{item.name}</Td>
                                        <Td>
                                            <IconButton
                                                type="button"
                                                aria-label="delete"
                                                onClick={(e) => {
                                                    e.currentTarget.disabled =
                                                        true;
                                                    remove(item.number);
                                                }}
                                            >
                                                <DeleteIcon color="red" />
                                            </IconButton>
                                        </Td>
                                    </tr>
                                ))}
                            </Tbody>
                            <TableCaption>保留中</TableCaption>
                        </Table>
                    </TableContainer>
                </CardBody>
            </Card>
            <Card>
                <CardBody>
                    <TableContainer width="100%">
                        <Table>
                            <Thead>
                                <Tr>
                                    <Td>番号</Td>
                                    <Td>予約時間</Td>
                                    <Td>グループ名</Td>
                                    <Td />
                                    <Td />
                                </Tr>
                            </Thead>
                            <Tbody>
                                {waitingList.map((item) => (
                                    <tr key={item.number}>
                                        <Td>{item.number}</Td>
                                        <Td>{item.date}</Td>
                                        <Td>{item.name}</Td>
                                        <Td>
                                            <IconButton
                                                type="button"
                                                aria-label="keep"
                                                onClick={(e) => {
                                                    e.currentTarget.disabled =
                                                        true;
                                                    keep(item.number);
                                                }}
                                            >
                                                <ArrowUpIcon color="orange" />
                                            </IconButton>
                                        </Td>
                                        <Td>
                                            <IconButton
                                                type="button"
                                                aria-label="delete"
                                                onClick={(e) => {
                                                    e.currentTarget.disabled =
                                                        true;
                                                    remove(item.number);
                                                }}
                                            >
                                                <DeleteIcon color="red" />
                                            </IconButton>
                                        </Td>
                                    </tr>
                                ))}
                            </Tbody>
                            <TableCaption>待機中</TableCaption>
                        </Table>
                    </TableContainer>
                </CardBody>
            </Card>
        </VStack>
    );
}
