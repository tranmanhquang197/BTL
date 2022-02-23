package com.tsolution._3services.impl;

import java.net.InetSocketAddress;
import java.net.Proxy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pengrad.telegrambot.TelegramBot;
import com.pengrad.telegrambot.request.SendMessage;
import com.tsolution.config.TelegramProperties;
import com.tsolution.utils.StringUtils;

import okhttp3.OkHttpClient;

@Service
public class TelegramService {
	private static final Logger logger = LoggerFactory.getLogger(TelegramService.class);
	private final String token;
	private final String chatId;
	private final String proxyHost;
	private final Integer proxyPort;
	private final TelegramBot bot;

	@Autowired
	public TelegramService(TelegramProperties telegramProperties) {
		this.token = telegramProperties.getToken();
		this.chatId = telegramProperties.getChatId();
		this.proxyHost = telegramProperties.getProxyHost();
		this.proxyPort = telegramProperties.getProxyPort();
		OkHttpClient.Builder builder = new OkHttpClient.Builder();
		if (!StringUtils.isNullOrEmpty(this.proxyHost) && (this.proxyPort != null)) {
			builder.proxy(new Proxy(Proxy.Type.HTTP, new InetSocketAddress(this.proxyHost, this.proxyPort)))
					.retryOnConnectionFailure(true);
		}
		OkHttpClient okHttpClient = builder.build();
		this.bot = new TelegramBot.Builder(this.token).okHttpClient(okHttpClient).build();
	}

	public void sendMessage(String chatId, String message) {
		try {
			this.bot.execute(new SendMessage(chatId, message));
		} catch (Exception e) {
			TelegramService.logger.error("Error send message to Telegram chatId: " + chatId + ", message: " + message,
					e);
		}
	}

	public boolean sendMessage(String message) {
		try {
			this.bot.execute(new SendMessage(this.chatId, message));
			return true;
		} catch (Exception e) {
			TelegramService.logger
					.error("Error send message to Telegram chatId: " + this.chatId + ", message: " + message, e);
			return false;
		}
	}

	public String getToken() {
		return this.token;
	}

	public TelegramBot getBot() {
		return this.bot;
	}
}
