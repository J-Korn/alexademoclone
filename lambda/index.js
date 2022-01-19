/* eslint-disable no-mixed-operators */
/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');

const STREAMS = [
  {
    'token': 'mega-radio',
    'url': 'https://streaming.myradio1046.fm/myradio1046',
    'metadata': {
      'title': 'Mega Channel',
      'subtitle': 'MyRadio 104,6',
      'art': {
        'sources': [
          {
            'contentDescription': 'Athen\'s New Music Radio',
            'url': 'https://www.myradio1046.fm/myradio_logo.png',
            'widthPixels': 666,
            'heightPixels': 288,
          },
        ],
      },
      'backgroundImage': {
        'sources': [
          {
            'contentDescription': 'Mega Radio',
            'url': 'https://www.myradio1046.fm/MAIN_BG.jpg',
            'widthPixels': 902,
            'heightPixels': 800,
          },
        ],
      },
    },
  }
];

const VIDEO_URL = 'https://c98db5952cb54b358365984178fb898a.msvdn.net/live/S86713049/gonOwuUacAxM/playlist.m3u8',
  VIDEO_TITLE = "One Channel",
  VIDEO_SUBTITLE = "Live TV",
  TITLE = 'One Channel',
  TEXT = `This is the live One Channel`;
  

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
      console.log("handing LaunchRequest");
      var responsetext = ' ';
        if(handlerInput.requestEnvelope.request.locale === 'de-DE'){
            responsetext = `Willkommen bei Mega Channel. Versuchen Sie, „Radio spielen“ oder „Fernsehen spielen“ zu sagen`;
        }else{
            responsetext = `Welcome to Mega Channel. You can try "Play Radio" or "Play TV"`;
        }
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
        console.log("APL Enabled");
        const documentName = "MegaIntro";
        const token = documentName + "Token";
        var primaryText, secondaryText;
        if(handlerInput.requestEnvelope.request.locale === 'de-DE'){
            primaryText = `Willkommen bei Mega Channel!`;
            secondaryText = 'Probiere „Radio spielen“ oder „Fernsehen spielen“';
        }else{
            primaryText = `Welcome to Mega Channel!`;
            secondaryText = 'Try "Play Radio" or "Play TV"';
        }
        console.log('doc://alexa/apl/documents/' + documentName);
        handlerInput
        return handlerInput.responseBuilder
            .withShouldEndSession(false)
            .addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: token,
                document: {
                    src: 'doc://alexa/apl/documents/' + documentName,
                    type: 'Link'
                },
                datasources: {
    "megaIntroDataSource": {
        "type": "object",
        "objectId": "headlineSample",
        "properties": {
            "title":"",
            "backgroundImage": {
                "contentDescription": null,
                "smallSourceUrl": null,
                "largeSourceUrl": null,
                "source":"https://www.megatv.com/wp-content/themes/whsk_megatv.com/common/imgs/mega_poster.jpg",
                "backgroundColor":"#001254"
            },
            "textContent": {
                "primaryText": {
                    "type": "PlainText",
                    "text": "Mega Channel"
                }
            },
            "logoUrl": "http://mega.smart-tv-data.com/img/logo.png",
            "secondaryText": secondaryText,
            "welcomeSpeechSSML": "<speak><amazon:emotion name='excited' intensity='medium'>Welcome to Mega Channel</amazon:emotion></speak>"
        },
        "transformers": [
            {
                "inputPath": "welcomeSpeechSSML",
                "transformer": "ssmlToSpeech",
                "outputName": "welcomeSpeech"
            }
        ]
    }
}
            })
            .speak(responsetext)
            .reprompt(responsetext)
            .getResponse();
    }else{
        
        return handlerInput.responseBuilder
            .speak(responsetext)
            .reprompt(responsetext)
            .getResponse();
    }
  },
};

const PlayRadioIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'PlayRadioIntent';
  },
  handle(handlerInput) {
    const stream = STREAMS[0];
    var responsetext = ' ';
    if(handlerInput.requestEnvelope.request.locale === 'de-DE'){
        responsetext = 'My Radio spielen 104.6';
    }else{
        responsetext = 'Playing My Radio 104.6';
    }
    handlerInput.responseBuilder
      .speak(responsetext)
      
      .addAudioPlayerPlayDirective('REPLACE_ALL', stream.url, stream.token, 0, null, stream.metadata);
      

    return handlerInput.responseBuilder
      .getResponse();
  }
}

const PlayTvIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
    && handlerInput.requestEnvelope.request.intent.name === 'PlayTvIntent';
  },
  handle(handlerInput) {
    const stream = STREAMS[1];
    let responseBuilder = handlerInput.responseBuilder;
    var responsetext = ' ';
    if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['VideoApp']) {
        
        if(handlerInput.requestEnvelope.request.locale === 'de-DE'){
            responsetext = 'Live spielen';
        }else{
            responsetext = 'Playing Live';
        }
        
        responseBuilder
            .addAudioPlayerClearQueueDirective('CLEAR_ALL')
            .addAudioPlayerStopDirective()
            .addDirective({
                "type": "VideoApp.Launch",
                "version": "1.0",
                "videoItem": {
                    "source": VIDEO_URL,
                    "metadata": {
                        "title": TITLE,
                        "subtitle": VIDEO_SUBTITLE
                    }
                }
            })
            .speak(responsetext)
            .reprompt(responsetext)
    } else {

        if(handlerInput.requestEnvelope.request.locale === 'de-DE'){
            responsetext = 'Das Video kann nicht auf Ihrem Gerät abgespielt werden. Um dieses Video anzusehen, versuchen Sie, diesen Skill von einem Echo-Show-Gerät aus zu starten.';
        }else{
            responsetext = 'The video cannot be played on your device. To watch this video, try launching this skill from an echo show device.';
        }
        
        responseBuilder
            .speak(responsetext)
            .reprompt(responsetext);
    }
    return responseBuilder
      .getResponse();
  }
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
      var responsetext = ' ';
        if(handlerInput.requestEnvelope.request.locale === 'de-DE'){
            responsetext = 'Probiere „Radio spielen“ oder „Fernsehen spielen“';
        }else{
            responsetext = 'Try "Play Radio" or "Play TV"';
        }

    return handlerInput.responseBuilder
      .speak(responsetext)
      .getResponse();
  },
};

const AboutIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AboutIntent';
  },
  handle(handlerInput) {
    var responsetext = ' ';
        if(handlerInput.requestEnvelope.request.locale === 'de-DE'){
            responsetext = 'Dies ist der Alexa-Skill für den Fernsehsender Mega Channel';
        }else{
            responsetext = 'This is the Alexa skill for Mega Channel TV station';
        }
    return handlerInput.responseBuilder
      .speak(responsetext)
      .reprompt(responsetext)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.PauseIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.LoopOffIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.ShuffleOffIntent'
      );
  },
  handle(handlerInput) {
      var goodbyeText = ' ';
        if(handlerInput.requestEnvelope.request.locale === 'de-DE'){
            goodbyeText = 'Auf Wiedersehen';
        }else{
            goodbyeText = 'Goodbye';
        }
    handlerInput.responseBuilder
        .addAudioPlayerClearQueueDirective('CLEAR_ALL')
        .addAudioPlayerStopDirective()
        .speak(goodbyeText);

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const PlaybackStoppedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'PlaybackController.PauseCommandIssued'
      || handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStopped';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ALL')
      .addAudioPlayerStopDirective();

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const PlaybackStartedIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'AudioPlayer.PlaybackStarted';
  },
  handle(handlerInput) {
    handlerInput.responseBuilder
      .addAudioPlayerClearQueueDirective('CLEAR_ENQUEUED');

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder
      .getResponse();
  },
};

const ExceptionEncounteredRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'System.ExceptionEncountered';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return true;
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(handlerInput.requestEnvelope.request.type);
    return handlerInput.responseBuilder
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    PlayTvIntentHandler,
    PlayRadioIntentHandler,
    PlaybackStartedIntentHandler,
    CancelAndStopIntentHandler,
    PlaybackStoppedIntentHandler,
    AboutIntentHandler,
    HelpIntentHandler,
    ExceptionEncounteredRequestHandler,
    SessionEndedRequestHandler,
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
