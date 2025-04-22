import { rabbitMQQueue, rabbitMqUrl } from '@lib/constants/rabbit-mq.constants';

export default () => ({
  rabbitmq: {
    url: rabbitMqUrl,
    chatQueue: rabbitMQQueue.FILE,
    deadLetterExchange: 'dlx',
    deadLetterRoutingKey: 'file_queue.dlq',
  },
});
