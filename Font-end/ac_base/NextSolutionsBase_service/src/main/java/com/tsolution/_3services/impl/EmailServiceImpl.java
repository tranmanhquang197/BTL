package com.tsolution._3services.impl;

import java.io.File;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.tsolution._3services.EmailService;

@Service("EmailService")
public class EmailServiceImpl implements EmailService {

	private static Logger log = LogManager.getLogger(EmailServiceImpl.class);

	@Autowired
	private JavaMailSender emailSender;

	@Value("${spring.mail.username}")
	private String username;

	@Override
	public void sendSimpleMessage(String to, String subject, String text) {
		try {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setFrom(this.username);
			message.setTo(to);
			message.setSubject(subject);
			message.setText(text);

			this.emailSender.send(message);
		} catch (MailException e) {
			EmailServiceImpl.log.error(e.getMessage(), e);
		}
	}

	@Override
	public void sendMessageWithAttachment(String to, String subject, String text, String pathToAttachment) {
		try {
			MimeMessage message = this.emailSender.createMimeMessage();
			// pass 'true' to the constructor to create a multipart message
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			helper.setFrom(this.username);
			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(text);

			FileSystemResource file = new FileSystemResource(new File(pathToAttachment));
			helper.addAttachment("Invoice", file);

			this.emailSender.send(message);
		} catch (MessagingException e) {
			EmailServiceImpl.log.error(e.getMessage(), e);
		}
	}

}
