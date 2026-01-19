import { useEffect, useRef, useState } from 'react';
import snapConfig from '../../config.js';
import { Socket } from 'phoenix';
import { CHAT_CONST } from '../Const/index.js';

export interface IPhoenixClientrops {
	data?: any;
	triggerPushMessageById?: any;
	triggerPushMessage?: any;
	chats?: any;
	clearTriggerPushMessage?: () => void;
	chatErrorCallback?: (value: any) => void;
	onReceiveMessage: (results: any) => void;
}

const PhoenixClient = (props: IPhoenixClientrops) => {
	const {
		data,
		triggerPushMessageById,
		triggerPushMessage,
		chats,
		clearTriggerPushMessage,
		chatErrorCallback,
		onReceiveMessage,
	} = props;

	const [isJoined, setIsJoined] = useState<boolean>(false);

	const tempSendChatId: any = useRef([]);

	const channelMsgRef: any = useRef(null);

	const dataRef = useRef(null);

	useEffect(() => {
		if (data != null && data?.roomId != null && data?.roomToken != null) {
			if (
				dataRef.current == null ||
				(dataRef.current != null && dataRef.current.roomId != data.roomId)
			) {
				dataRef.current = data;
				initSocket();
				console.log('props data');
			}
		}
	}, [data]);

	const initSocket = () => {
		const socket = new Socket(snapConfig.WS_URL, {
			params: {
				token: data?.roomToken,
			},
		});
		socket.connect();

		channelMsgRef.current = socket.channel('chat_auth:' + data?.roomId, {
			token: data?.roomToken,
		});

		channelMsgRef.current
			.join()
			.receive('ok', async (res: any) => {
				setIsJoined(true);
				console.log('success join channel', res);
			})
			.receive('error', (res: any) => console.log('error join channel', res));

		channelMsgRef.current.on('shout', (res) => {
			if (res?.response === CHAT_CONST.PONG || res?.type === CHAT_CONST.PING) {
				console.log('ping');
			} else {
				tempSendChatId.current = tempSendChatId.current?.filter((e: any) => e != res?.localId);

				onReceiveMessage(res);
			}
		});
	};

	useEffect(() => {
		if (triggerPushMessageById) {
			onPushMessageById(triggerPushMessageById);
		}
	}, [triggerPushMessageById]);

	useEffect(() => {
		if (triggerPushMessage) {
			onPushMessage(triggerPushMessage);
		}
	}, [triggerPushMessage]);

	const onPushMessageById = (id: string) => {
		if (!channelMsgRef.current) {
			return;
		}
		const index = chats.findIndex((e: any) => e.localId == id);
		console.log('index', index, props.chats);
		if (index < 0) return;

		const tempChats = chats.map((item: any) => ({ ...item }));
		tempChats[index].status = CHAT_CONST.SENT;
		const tempChat = tempChats[index];
		console.log('about to send, onreceive-', tempChat);
		if (tempChat?.type == CHAT_CONST.MESSAGE || tempChat?.type == CHAT_CONST.ATTACHMENTS) {
			clearTriggerPushMessage();
		}

		tempSendChatId.current = [...tempSendChatId.current, tempChat?.localId];
		setTimeout(() => {
			if (tempSendChatId.current?.some((e: any) => e == tempChat?.localId)) {
				chatErrorCallback(tempChat?.localId);
			}
		}, 10000);

		channelMsgRef.current
			.push('shout', tempChat)
			.receive('ok', () => console.log('okok'))
			.receive('error', () => {
				console.log('error');
				chatErrorCallback(id);
			})
			.receive('timeout', () => {
				console.log('timeout');
			});
	};

	const onPushMessage = (chat: any) => {
		if (!channelMsgRef.current) {
			return;
		}
		if (chat?.type == CHAT_CONST.MESSAGE) {
			clearTriggerPushMessage();
		}
		channelMsgRef.current
			.push('shout', chat)
			.receive('ok', () => console.log('okok'))
			.receive('error', () => {
				console.log('error');
				chatErrorCallback(chat);
			})
			.receive('timeout', () => {
				console.log('timeout');
			});
	};

	return null;
};

export default PhoenixClient;
