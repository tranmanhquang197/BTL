package com.tsolution._3services;

public interface EmailService {
	void sendSimpleMessage(String to, String subject, String text);

	void sendMessageWithAttachment(String to, String subject, String text, String pathToAttachment);

}
