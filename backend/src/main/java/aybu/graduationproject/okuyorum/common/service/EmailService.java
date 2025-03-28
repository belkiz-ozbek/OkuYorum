package aybu.graduationproject.okuyorum.common.service;

import aybu.graduationproject.okuyorum.donation.entity.Donation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.MailException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;

@Service
public class EmailService {
    private final JavaMailSender mailSender;
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.images.path:src/main/resources/static/images}")
    private String imagesPath;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String toEmail, String verificationCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        try {
            helper.setFrom(fromEmail, "OkuYorum Doğrulama");
        } catch (UnsupportedEncodingException e) {
            logger.warn("Encoding error while setting from address: {}", e.getMessage());
            helper.setFrom(fromEmail);
        }

        helper.setTo(toEmail);
        helper.setSubject("☕ Okuyorum - E-posta Doğrulama Kodun");
        helper.setText(String.format("""
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; background-image: url('%s/pattern.png'); background-repeat: repeat; background-size: 200px;">
                <div style="text-align: center; margin-bottom: 30px; padding: 20px;">
                    <img src="%s/logo.png" alt="Okuyorum Logo" style="max-width: 150px; height: auto;">
                    <h1 style="color: #5D4037; margin: 10px 0 0; font-size: 32px; font-weight: 700;">Okuyorum</h1>
                    <p style="color: #8D6E63; margin-top: 5px; font-style: italic;">Kitaplarla dolu bir dünya...</p>
                </div>
                <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <h2 style="color: #5D4037; margin-bottom: 20px; font-size: 24px;">Merhaba Kitapsever,</h2>
                    <p style="color: #5D4037; margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
                        Okuyorum'a adım attığın için çok mutluyuz! 🌿✨ Şimdi, buradaki yolculuğuna başlayabilmen için tek bir adım kaldı.
                    </p>
                    <p style="color: #5D4037; margin-bottom: 10px; font-size: 16px;">E-posta adresini doğrulamak için bu kodu kullanabilirsin:</p>
                    <div style="background: linear-gradient(135deg, #F9F5EB 0%%, #E4D5C3 100%%); padding: 25px; border-radius: 10px; text-align: center; margin: 25px 0; border: 1px dashed #8D6E63;">
                        <h2 style="color: #5D4037; letter-spacing: 5px; margin: 0; font-size: 36px; font-weight: 700;">💫 %s 💫</h2>
                    </div>
                    <p style="color: #8D6E63; font-size: 14px; margin-bottom: 20px;">Bu kod kısa bir süre geçerli, o yüzden çok da bekletme. Eğer bu isteği sen göndermediysen, bu e-postayı görmezden gelebilirsin.</p>
                    <p style="color: #5D4037; font-size: 16px; margin-top: 30px;">Güzel hikâyelerde buluşmak dileğiyle, keyifli okumalar! ☕📚☺️</p>
                </div>
                <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #E6D7C3 0%%, #C8B6A6 100%%); border-radius: 8px;">
                    <p style="color: #5D4037; font-size: 16px; margin: 0; font-weight: 600;">
                        Sevgiler,<br>
                        Okuyorum Ekibi 💛
                    </p>
                </div>
                <div style="text-align: center; margin-top: 20px;">
                    <p style="color: #8D6E63; font-size: 12px;">
                        Bu e-posta Okuyorum hesabınızı doğrulamak için gönderilmiştir.<br>
                        Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.
                    </p>
                </div>
            </div>
        """, imagesPath, imagesPath, verificationCode), true);

        mailSender.send(message);
    }

    public void sendDonationConfirmationEmail(String toEmail, Donation donation) {
        try {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("Email adresi boş olamaz");
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            try {
                helper.setFrom(fromEmail, "OkuYorum Bağış");
            } catch (UnsupportedEncodingException e) {
                logger.warn("Encoding error while setting from address: {}", e.getMessage());
                helper.setFrom(fromEmail);
            }

            helper.setTo(toEmail);
            helper.setSubject("📚 Okuyorum - Bağışınız İçin Teşekkürler!");
            helper.setText(String.format("""
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; background-image: url('%s/pattern.png'); background-repeat: repeat; background-size: 200px;">
                    <div style="text-align: center; margin-bottom: 30px; padding: 20px;">
                        <img src="%s/logo.png" alt="Okuyorum Logo" style="max-width: 150px; height: auto;">
                        <h1 style="color: #5D4037; margin: 10px 0 0; font-size: 32px; font-weight: 700;">Okuyorum</h1>
                        <p style="color: #8D6E63; margin-top: 5px; font-style: italic;">Kitaplarla dolu bir dünya...</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="%s/thank-you.png" alt="Teşekkür" style="max-width: 100px; height: auto;">
                            <h2 style="color: #5D4037; margin: 15px 0; font-size: 28px;">Bağışınız İçin Teşekkürler!</h2>
                            <p style="color: #8D6E63; font-size: 18px; margin: 0;">Her kitap, yeni bir umut demektir 🌟</p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #F9F5EB 0%%, #E4D5C3 100%%); padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px dashed #8D6E63;">
                            <h3 style="color: #5D4037; margin: 0 0 15px 0; font-size: 22px; text-align: center;">Bağış Detayları</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Kitap Adı</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%s</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Yazar</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%s</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Adet</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%d</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Durum</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">İnceleme Aşamasında</p>
                                </div>
                            </div>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="/donations/track/%s" style="display: inline-block; background: linear-gradient(135deg, #5D4037 0%%, #8D6E63 100%%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.3s ease;">Bağışınızı Takip Et</a>
                        </div>

                        <div style="background: #F9F5EB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="color: #5D4037; margin: 0 0 10px 0; font-size: 18px;">📋 Sonraki Adımlar</h4>
                            <ol style="color: #8D6E63; margin: 0; padding-left: 20px;">
                                <li>Bağışınız incelenecek</li>
                                <li>Onay sonrası size bilgi verilecek</li>
                                <li>Kitabınız uygun kuruma iletilecek</li>
                            </ol>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #F9F5EB 0%%, #E4D5C3 100%%); border-radius: 8px;">
                            <h4 style="color: #5D4037; margin: 0 0 15px 0; font-size: 20px;">Bizi Sosyal Medyada Takip Edin</h4>
                            <p style="color: #8D6E63; font-size: 14px; margin-bottom: 20px;">Yeni bağışlar ve güncellemeler için sosyal medya hesaplarımızı takip edebilirsiniz.</p>
                            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                                <a href="https://instagram.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: linear-gradient(45deg, #f09433 0%%, #e6683c 25%%, #dc2743 50%%, #cc2366 75%%, #bc1888 100%%); border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/instagram-icon.png" alt="Instagram" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                                <a href="https://twitter.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #1DA1F2; border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/twitter-icon.png" alt="Twitter" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                                <a href="https://facebook.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #4267B2; border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/facebook-icon.png" alt="Facebook" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                            </div>
                            <div style="display: flex; justify-content: center; gap: 15px; font-size: 14px; color: #8D6E63;">
                                <span>@okuyorum</span>
                                <span>•</span>
                                <span>@okuyorum</span>
                                <span>•</span>
                                <span>@okuyorum</span>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #E6D7C3 0%%, #C8B6A6 100%%); border-radius: 8px;">
                        <p style="color: #5D4037; font-size: 16px; margin: 0; font-weight: 600;">
                            Sevgiler,<br>
                            Okuyorum Ekibi 💛
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 20px;">
                        <p style="color: #8D6E63; font-size: 12px;">
                            Bu e-posta Okuyorum bağış işleminiz için gönderilmiştir.<br>
                            Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.
                        </p>
                    </div>
                </div>
            """, imagesPath, imagesPath, imagesPath, donation.getBookTitle(), donation.getAuthor(), donation.getQuantity(), donation.getId(), imagesPath, imagesPath, imagesPath), true);
            
            mailSender.send(message);
            logger.info("Bağış onay emaili gönderildi: {}", toEmail);
        } catch (MailException | MessagingException e) {
            logger.error("Email gönderimi sırasında hata oluştu: {}", e.getMessage());
        }
    }

    public void sendInstitutionNotificationEmail(Donation donation) {
        try {
            if (donation.getInstitutionName() == null || donation.getInstitutionName().trim().isEmpty()) {
                logger.error("Kurum adı boş olamaz");
                return;
            }

            String institutionEmail = donation.getInstitutionName().toLowerCase()
                .replaceAll("[^a-z0-9]", "") + "@example.com";

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            try {
                helper.setFrom(fromEmail, "OkuYorum Kurum Bildirimi");
            } catch (UnsupportedEncodingException e) {
                logger.warn("Encoding error while setting from address: {}", e.getMessage());
                helper.setFrom(fromEmail);
            }

            helper.setTo(institutionEmail);
            helper.setSubject("📚 Okuyorum - Yeni Kitap Bağışı!");
            helper.setText(String.format("""
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; background-image: url('%s/pattern.png'); background-repeat: repeat; background-size: 200px;">
                    <div style="text-align: center; margin-bottom: 30px; padding: 20px;">
                        <img src="%s/logo.png" alt="Okuyorum Logo" style="max-width: 150px; height: auto;">
                        <h1 style="color: #5D4037; margin: 10px 0 0; font-size: 32px; font-weight: 700;">Okuyorum</h1>
                        <p style="color: #8D6E63; margin-top: 5px; font-style: italic;">Kitaplarla dolu bir dünya...</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="%s/donation-notification.png" alt="Bağış Bildirimi" style="max-width: 100px; height: auto;">
                            <h2 style="color: #5D4037; margin: 15px 0; font-size: 28px;">Yeni Kitap Bağışı!</h2>
                            <p style="color: #8D6E63; font-size: 18px; margin: 0;">Kurumunuza yeni bir kitap bağışı yapıldı 📚</p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #F9F5EB 0%%, #E4D5C3 100%%); padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px dashed #8D6E63;">
                            <h3 style="color: #5D4037; margin: 0 0 15px 0; font-size: 22px; text-align: center;">Bağış Detayları</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Kitap Adı</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%s</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Yazar</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%s</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Adet</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%d</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Durum</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">İnceleme Aşamasında</p>
                                </div>
                            </div>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="/institution/donations/%s" style="display: inline-block; background: linear-gradient(135deg, #5D4037 0%%, #8D6E63 100%%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.3s ease;">Bağış Detaylarını İncele</a>
                        </div>

                        <div style="background: #F9F5EB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="color: #5D4037; margin: 0 0 10px 0; font-size: 18px;">📋 Sonraki Adımlar</h4>
                            <ol style="color: #8D6E63; margin: 0; padding-left: 20px;">
                                <li>Bağış detaylarını inceleyin</li>
                                <li>Kabul/Red durumunu belirleyin</li>
                                <li>Bağışçıya bilgi verin</li>
                            </ol>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #F9F5EB 0%%, #E4D5C3 100%%); border-radius: 8px;">
                            <h4 style="color: #5D4037; margin: 0 0 15px 0; font-size: 20px;">Bizi Sosyal Medyada Takip Edin</h4>
                            <p style="color: #8D6E63; font-size: 14px; margin-bottom: 20px;">Yeni bağışlar ve güncellemeler için sosyal medya hesaplarımızı takip edebilirsiniz.</p>
                            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                                <a href="https://instagram.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: linear-gradient(45deg, #f09433 0%%, #e6683c 25%%, #dc2743 50%%, #cc2366 75%%, #bc1888 100%%); border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/instagram-icon.png" alt="Instagram" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                                <a href="https://twitter.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #1DA1F2; border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/twitter-icon.png" alt="Twitter" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                                <a href="https://facebook.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #4267B2; border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/facebook-icon.png" alt="Facebook" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                            </div>
                            <div style="display: flex; justify-content: center; gap: 15px; font-size: 14px; color: #8D6E63;">
                                <span>@okuyorum</span>
                                <span>•</span>
                                <span>@okuyorum</span>
                                <span>•</span>
                                <span>@okuyorum</span>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #E6D7C3 0%%, #C8B6A6 100%%); border-radius: 8px;">
                        <p style="color: #5D4037; font-size: 16px; margin: 0; font-weight: 600;">
                            Saygılarımızla,<br>
                            Okuyorum Ekibi 💛
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 20px;">
                        <p style="color: #8D6E63; font-size: 12px;">
                            Bu e-posta Okuyorum kurum bilgilendirme sistemi tarafından gönderilmiştir.<br>
                            Eğer bu e-postayı yanlışlıkla aldıysanız, lütfen dikkate almayın.
                        </p>
                    </div>
                </div>
            """, imagesPath, imagesPath, imagesPath, donation.getBookTitle(), donation.getAuthor(), donation.getQuantity(), donation.getId(), imagesPath, imagesPath, imagesPath), true);
            
            mailSender.send(message);
            logger.info("Kurum bilgilendirme emaili gönderildi: {}", institutionEmail);
        } catch (MailException | MessagingException e) {
            logger.error("Kurum emaili gönderimi sırasında hata oluştu: {}", e.getMessage());
        }
    }

    public void sendDonationStatusUpdateEmail(String toEmail, Donation donation) {
        try {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("Email adresi boş olamaz");
                return;
            }

            String statusText = getStatusText(donation.getStatus());
            String statusDescription = getStatusDescription(donation.getStatus());

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            try {
                helper.setFrom(fromEmail, "OkuYorum Durum Güncellemesi");
            } catch (UnsupportedEncodingException e) {
                logger.warn("Encoding error while setting from address: {}", e.getMessage());
                helper.setFrom(fromEmail);
            }

            helper.setTo(toEmail);
            helper.setSubject("📚 Okuyorum - Bağış Durumu Güncellendi: " + statusText);
            helper.setText(String.format("""
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; background-image: url('%s/pattern.png'); background-repeat: repeat; background-size: 200px;">
                    <div style="text-align: center; margin-bottom: 30px; padding: 20px;">
                        <img src="%s/logo.png" alt="Okuyorum Logo" style="max-width: 150px; height: auto;">
                        <h1 style="color: #5D4037; margin: 10px 0 0; font-size: 32px; font-weight: 700;">Okuyorum</h1>
                        <p style="color: #8D6E63; margin-top: 5px; font-style: italic;">Kitaplarla dolu bir dünya...</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="%s/status-update.png" alt="Durum Güncellemesi" style="max-width: 100px; height: auto;">
                            <h2 style="color: #5D4037; margin: 15px 0; font-size: 28px;">Bağış Durumu Güncellendi</h2>
                            <p style="color: #8D6E63; font-size: 18px; margin: 0;">%s</p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #F9F5EB 0%%, #E4D5C3 100%%); padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px dashed #8D6E63;">
                            <h3 style="color: #5D4037; margin: 0 0 15px 0; font-size: 22px; text-align: center;">Bağış Detayları</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Kitap Adı</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%s</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Yazar</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%s</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Adet</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%d</p>
                                </div>
                                <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                                    <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">Güncel Durum</p>
                                    <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%s</p>
                                </div>
                            </div>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="/donations/track/%s" style="display: inline-block; background: linear-gradient(135deg, #5D4037 0%%, #8D6E63 100%%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.3s ease;">Bağışınızı Takip Et</a>
                        </div>

                        <div style="background: #F9F5EB; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h4 style="color: #5D4037; margin: 0 0 10px 0; font-size: 18px;">📋 Durum Açıklaması</h4>
                            <p style="color: #8D6E63; margin: 0; line-height: 1.6;">%s</p>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #F9F5EB 0%%, #E4D5C3 100%%); border-radius: 8px;">
                            <h4 style="color: #5D4037; margin: 0 0 15px 0; font-size: 20px;">Bizi Sosyal Medyada Takip Edin</h4>
                            <p style="color: #8D6E63; font-size: 14px; margin-bottom: 20px;">Yeni bağışlar ve güncellemeler için sosyal medya hesaplarımızı takip edebilirsiniz.</p>
                            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                                <a href="https://instagram.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: linear-gradient(45deg, #f09433 0%%, #e6683c 25%%, #dc2743 50%%, #cc2366 75%%, #bc1888 100%%); border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/instagram-icon.png" alt="Instagram" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                                <a href="https://twitter.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #1DA1F2; border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/twitter-icon.png" alt="Twitter" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                                <a href="https://facebook.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #4267B2; border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/facebook-icon.png" alt="Facebook" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                            </div>
                            <div style="display: flex; justify-content: center; gap: 15px; font-size: 14px; color: #8D6E63;">
                                <span>@okuyorum</span>
                                <span>•</span>
                                <span>@okuyorum</span>
                                <span>•</span>
                                <span>@okuyorum</span>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #E6D7C3 0%%, #C8B6A6 100%%); border-radius: 8px;">
                        <p style="color: #5D4037; font-size: 16px; margin: 0; font-weight: 600;">
                            Sevgiler,<br>
                            Okuyorum Ekibi 💛
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 20px;">
                        <p style="color: #8D6E63; font-size: 12px;">
                            Bu e-posta Okuyorum bağış takip sistemi tarafından gönderilmiştir.<br>
                            Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.
                        </p>
                    </div>
                </div>
            """, imagesPath, imagesPath, imagesPath, statusText, donation.getBookTitle(), donation.getAuthor(), donation.getQuantity(), statusText, donation.getId(), statusDescription), true);
            
            mailSender.send(message);
            logger.info("Bağış durum güncelleme emaili gönderildi: {}", toEmail);
        } catch (MailException | MessagingException e) {
            logger.error("Email gönderimi sırasında hata oluştu: {}", e.getMessage());
        }
    }
    
    /**
     * Bağış durumuna göre metin açıklaması döndürür
     */
    private String getStatusText(aybu.graduationproject.okuyorum.donation.entity.DonationStatus status) {
        return switch (status) {
            case PENDING -> "Beklemede";
            case APPROVED -> "Onaylandı";
            case PREPARING -> "Hazırlanıyor";
            case READY_FOR_PICKUP -> "Teslim Almaya Hazır";
            case IN_TRANSIT -> "Taşınıyor";
            case DELIVERED -> "Teslim Edildi";
            case RECEIVED_BY_RECIPIENT -> "Alıcı Tarafından Alındı";
            case COMPLETED -> "Tamamlandı";
            case REJECTED -> "Reddedildi";
            case CANCELLED -> "İptal Edildi";
        };
    }
    
    /**
     * Bağış durumuna göre detaylı açıklama döndürür
     */
    private String getStatusDescription(aybu.graduationproject.okuyorum.donation.entity.DonationStatus status) {
        return switch (status) {
            case PENDING -> "Bağışınız şu anda inceleme aşamasındadır. En kısa sürede değerlendirilecektir.";
            case APPROVED -> "Bağışınız onaylandı ve işleme alındı. Kitaplarınız hazırlanmaya başlanacak.";
            case PREPARING -> "Kitaplarınız şu anda hazırlanıyor ve paketleniyor.";
            case READY_FOR_PICKUP -> "Kitaplarınız paketlendi ve teslim almaya hazır.";
            case IN_TRANSIT -> "Kitaplarınız şu anda alıcıya doğru yolda.";
            case DELIVERED -> "Kitaplarınız teslim noktasına ulaştı.";
            case RECEIVED_BY_RECIPIENT -> "Kitaplarınız alıcı tarafından teslim alındı.";
            case COMPLETED -> """
                Tebrikler! 🎉 Bağış süreciniz başarıyla tamamlandı.
                
                🏆 Bu bağışınız için kazandıklarınız:
                • 100 Okuyorum Puanı
                • "Kitap Dostu" rozetini kazandınız
                • Toplam bağış sayınız arttı
                
                Katkınız için çok teşekkür ederiz! Her bağışınız bir çocuğun hayatına dokunuyor.
                """;
            case REJECTED -> "Bağışınız bazı nedenlerden dolayı kabul edilemedi. Detaylı bilgi için lütfen bizimle iletişime geçin.";
            case CANCELLED -> "Bağışınız iptal edildi.";
        };
    }

    public void sendDonationTrackingUpdateEmail(String toEmail, Donation donation) {
        try {
            if (toEmail == null || toEmail.trim().isEmpty()) {
                logger.error("Email adresi boş olamaz");
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            try {
                helper.setFrom(fromEmail, "OkuYorum Takip Güncellemesi");
            } catch (UnsupportedEncodingException e) {
                logger.warn("Encoding error while setting from address: {}", e.getMessage());
                helper.setFrom(fromEmail);
            }

            helper.setTo(toEmail);
            helper.setSubject("📚 Okuyorum - Bağış Takip Bilgileri Güncellendi");
            helper.setText(String.format("""
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f7f4; background-image: url('%s/pattern.png'); background-repeat: repeat; background-size: 200px;">
                    <div style="text-align: center; margin-bottom: 30px; padding: 20px;">
                        <img src="%s/logo.png" alt="Okuyorum Logo" style="max-width: 150px; height: auto;">
                        <h1 style="color: #5D4037; margin: 10px 0 0; font-size: 32px; font-weight: 700;">Okuyorum</h1>
                        <p style="color: #8D6E63; margin-top: 5px; font-style: italic;">Kitaplarla dolu bir dünya...</p>
                    </div>
                    <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <img src="%s/tracking-update.png" alt="Takip Güncellemesi" style="max-width: 100px; height: auto;">
                            <h2 style="color: #5D4037; margin: 15px 0; font-size: 28px;">Takip Bilgileri Güncellendi</h2>
                            <p style="color: #8D6E63; font-size: 18px; margin: 0;">%s kitabınız için yeni takip bilgileri mevcut</p>
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #F9F5EB 0%%, #E4D5C3 100%%); padding: 25px; border-radius: 10px; margin: 25px 0; border: 1px dashed #8D6E63;">
                            <h3 style="color: #5D4037; margin: 0 0 15px 0; font-size: 22px; text-align: center;">Güncel Takip Bilgileri</h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                %s
                                %s
                                %s
                                %s
                            </div>
                        </div>

                        <div style="text-align: center; margin: 30px 0;">
                            <a href="/donations/track/%s" style="display: inline-block; background: linear-gradient(135deg, #5D4037 0%%, #8D6E63 100%%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 10px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.3s ease;">Bağışınızı Takip Et</a>
                        </div>

                        <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #F9F5EB 0%%, #E4D5C3 100%%); border-radius: 8px;">
                            <h4 style="color: #5D4037; margin: 0 0 15px 0; font-size: 20px;">Bizi Sosyal Medyada Takip Edin</h4>
                            <p style="color: #8D6E63; font-size: 14px; margin-bottom: 20px;">Yeni bağışlar ve güncellemeler için sosyal medya hesaplarımızı takip edebilirsiniz.</p>
                            <div style="display: flex; justify-content: center; gap: 20px; margin-bottom: 20px;">
                                <a href="https://instagram.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: linear-gradient(45deg, #f09433 0%%, #e6683c 25%%, #dc2743 50%%, #cc2366 75%%, #bc1888 100%%); border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/instagram-icon.png" alt="Instagram" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                                <a href="https://twitter.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #1DA1F2; border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/twitter-icon.png" alt="Twitter" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                                <a href="https://facebook.com/okuyorum" style="display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; background: #4267B2; border-radius: 50%%; text-decoration: none; transition: transform 0.3s ease;">
                                    <img src="%s/facebook-icon.png" alt="Facebook" style="width: 20px; height: 20px; filter: brightness(0) invert(1);">
                                </a>
                            </div>
                            <div style="display: flex; justify-content: center; gap: 15px; font-size: 14px; color: #8D6E63;">
                                <span>@okuyorum</span>
                                <span>•</span>
                                <span>@okuyorum</span>
                                <span>•</span>
                                <span>@okuyorum</span>
                            </div>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #E6D7C3 0%%, #C8B6A6 100%%); border-radius: 8px;">
                        <p style="color: #5D4037; font-size: 16px; margin: 0; font-weight: 600;">
                            Sevgiler,<br>
                            Okuyorum Ekibi 💛
                        </p>
                    </div>

                    <div style="text-align: center; margin-top: 20px;">
                        <p style="color: #8D6E63; font-size: 12px;">
                            Bu e-posta Okuyorum bağış takip sistemi tarafından gönderilmiştir.<br>
                            Eğer bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.
                        </p>
                    </div>
                </div>
            """, 
            imagesPath, imagesPath, imagesPath, donation.getBookTitle(),
            donation.getTrackingCode() != null ? createTrackingInfoCard("Takip Kodu", donation.getTrackingCode()) : "",
            donation.getDeliveryMethod() != null ? createTrackingInfoCard("Teslimat Yöntemi", donation.getDeliveryMethod()) : "",
            donation.getEstimatedDeliveryDate() != null ? createTrackingInfoCard("Tahmini Teslimat", donation.getEstimatedDeliveryDate().toLocalDate().toString()) : "",
            donation.getHandlerName() != null ? createTrackingInfoCard("İlgilenen Görevli", donation.getHandlerName()) : "",
            donation.getId()), true);

            mailSender.send(message);
            logger.info("Bağış takip bilgileri güncelleme emaili gönderildi: {}", toEmail);
        } catch (MailException | MessagingException e) {
            logger.error("Email gönderimi sırasında hata oluştu: {}", e.getMessage());
        }
    }

    private String createTrackingInfoCard(String label, String value) {
        return String.format("""
            <div style="background: rgba(255,255,255,0.5); padding: 15px; border-radius: 8px;">
                <p style="color: #8D6E63; margin: 0 0 5px 0; font-size: 14px;">%s</p>
                <p style="color: #5D4037; margin: 0; font-size: 16px; font-weight: 600;">%s</p>
            </div>
        """, label, value);
    }

    private String createRewardsSection() {
        return """
            <div style="background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center;">
                <h3 style="color: #5D4037; margin: 0 0 15px 0; font-size: 24px;">🎉 Kazanımlarınız</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                    <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; margin-bottom: 5px;">💯</div>
                        <p style="color: #5D4037; margin: 0; font-weight: 600;">100 Puan</p>
                        <p style="color: #8D6E63; margin: 5px 0 0; font-size: 12px;">Okuyorum Puanı</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; margin-bottom: 5px;">🏆</div>
                        <p style="color: #5D4037; margin: 0; font-weight: 600;">Yeni Rozet</p>
                        <p style="color: #8D6E63; margin: 5px 0 0; font-size: 12px;">Kitap Dostu</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.9); padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 24px; margin-bottom: 5px;">📈</div>
                        <p style="color: #5D4037; margin: 0; font-weight: 600;">İlerleme</p>
                        <p style="color: #8D6E63; margin: 5px 0 0; font-size: 12px;">Bağış Sayınız Arttı</p>
                    </div>
                </div>
            </div>
        """;
    }

    private String createAchievementsSection() {
        return """
            <div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #E6D7C3 0%, #C8B6A6 100%); border-radius: 10px;">
                <h4 style="color: #5D4037; margin: 0 0 15px 0; font-size: 20px;">🌟 Başarılarınız</h4>
                <p style="color: #5D4037; font-size: 16px; margin: 0 0 20px;">Her bağışınız bir çocuğun hayatına dokunuyor!</p>
                <div style="display: flex; justify-content: center; gap: 15px;">
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 20px;">
                        <span style="color: #5D4037; font-weight: 600;">Toplam Bağış: </span>
                        <span style="color: #8D6E63;">+1</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.9); padding: 10px 20px; border-radius: 20px;">
                        <span style="color: #5D4037; font-weight: 600;">Toplam Puan: </span>
                        <span style="color: #8D6E63;">+100</span>
                    </div>
                </div>
            </div>
        """;
    }
} 