import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Card,
    CardBody,
    Container,
    Flex,
    Heading,
    Text,
} from '@chakra-ui/react';
import { LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { prisma } from '~/libs/db';
import { useSocketStore } from '~/store/socket';

export const meta: MetaFunction = () => {
    return [
        { title: 'カウント' },
        {
            name: 'description',
            content: 'カウント表示',
        },
    ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const { uuid } = params;

    if (!uuid) return 404;

    const self = await prisma.reservation.findFirst({ where: { uuid } });

    if (!self) return 404;

    return {
        number: self?.number,
        count: await prisma.reservation.count({
            where: { number: { lt: self?.number } },
        }),
    };
};

export default function Count() {
    const [uuid, setUUID] = useState('');
    const data = useLoaderData<typeof loader>();
    const { revalidate } = useRevalidator();
    const socket = useSocketStore((store) => store.socket);

    if (data === 404) {
        return (
            <Container>
                <Card>
                    <CardBody>
                        <Alert status="error">
                            <AlertIcon />
                            <AlertTitle>404</AlertTitle>
                            <AlertDescription>
                                存在しない予約または予約がキャンセルされました
                            </AlertDescription>
                        </Alert>
                    </CardBody>
                </Card>
            </Container>
        );
    }
    const { number, count } = data;

    useEffect(() => {
        socket.on('update', revalidate);
        setUUID(location.pathname.split('/').at(-1) || '');

        return () => {
            socket.off('update', revalidate);
        };
    }, []);

    return (
        // <Container>
        //     <Grid>
        //         <GridItem display="flex" alignItems="center">
        //             <>
        //                 <Text>あなたの番号は：</Text>
        //                 <Text>{number}番</Text>
        //             </>
        //         </GridItem>
        //     </Grid>
        //     <Grid>
        //         <GridItem display="flex" alignItems="center">
        //             <Text>残り：{count}組</Text>
        //         </GridItem>
        //     </Grid>
        //     {count ? (
        //         <Grid>
        //             <GridItem display="flex" alignItems="center">
        //                 <Text>待ち時間：残り約{count * 5}分</Text>
        //             </GridItem>
        //         </Grid>
        //     ) : (
        //         <Grid>
        //             <GridItem>
        //                 <Text>あなたの番です</Text>
        //             </GridItem>
        //         </Grid>
        //     )}
        // </Container>
        <Container>
            <Text size="xs" color="gray">
                ID: {uuid}
            </Text>
            <Text size="xs" color="gray">
                番号: {number}
            </Text>
            <Card>
                <CardBody>
                    <Flex direction="row" alignItems="center">
                        <Text>残り</Text>
                        <Heading size="xl">{count}</Heading>
                        <Text>組</Text>
                    </Flex>
                    <Flex direction="row" alignItems="center">
                        <Text>待ち時間 約</Text>
                        <Heading size="md" p={1}>
                            {count * 5}
                        </Heading>
                        <Text>分</Text>
                    </Flex>
                    {count === 0 && <Text>順番が来ました</Text>}
                </CardBody>
            </Card>
        </Container>
    );
}
