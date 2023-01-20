import { MapTo } from '@/editable/ComponentMapping';
import CompositeRoute from '@/components/CompositeRoute.vue';
import Container from '@/components/Container.vue';
import ResponsiveGrid from '@/components/ResponsiveGrid.vue';
import AllowedComponentsContainer from '@/components/AllowedComponentsContainer.vue';
import Carousel from '@/components/Carousel.vue';
import Weather from '@/components/Weather.vue';
import Calendar from '@/components/Calendar.vue';
import AemImage from '@/components/AemImage.vue';
import Navigation from '@/components/Navigation.vue';
import AemText from '@/components/AemText.vue';
import AemTitle from '@/components/AemTitle.vue';
import AemHeader from '@/components/AemHeader.vue';
import { Component } from 'vue';

const ExperienceFragmentVariationConfig = {
  emptyLabel: 'Experience Fragment',

  isEmpty(props: any) {
    return !props || !props.configured;
  },
};

const ResponsiveGridConfig = {
  emptyLabel: 'ResponsiveGrid',

  isEmpty(props: any) {
    return props.cqItemsOrder && props.cqItemsOrder.length > 0;
  },
};

const AllowedComponentsContainerConfig = {
  emptyLabel: 'Container',

  isEmpty(props: any) {
    return !props || !props.cqItemsOrder || props.cqItemsOrder.length === 0;
  },
};

const ContainerConfig = {
  emptyLabel: 'Container',

  isEmpty(props: any) {
    return props.cqItemsOrder == null || props.cqItemsOrder.length === 0;
  },
};

const TextEditConfig = {
  emptyLabel: 'Text',

  isEmpty(props: any) {
    return !props || !props.text || props.text.trim().length < 1;
  },
};

const ImageEditConfig = {
  emptyLabel: 'Image',

  isEmpty(props: any) {
    return !props.src || props.src.trim().length === 0;
  },
};

const TitleEditConfig = {
  emptyLabel: 'Title',

  isEmpty(props: any) {
    return props.text == null || props.text.trim().length === 0;
  },
};

const AemHeaderConfig = {
  emptyLabel: 'Header',

  isEmpty(props: any) {
    return props.homePage == null || props.homePage.trim().length === 0;
  },
};

MapTo('stanley/components/page')(CompositeRoute);

MapTo('stanley/components/experiencefragment')(
  Container,
  ExperienceFragmentVariationConfig
);

MapTo('wcm/foundation/components/responsivegrid')(
  ResponsiveGrid,
  ResponsiveGridConfig
);

MapTo('stanley/components/container')(
  AllowedComponentsContainer,
  AllowedComponentsContainerConfig
);

// MapTo('stanley/components/container')(Container, ContainerConfig);
MapTo('stanley/components/text')(AemText, TextEditConfig);
MapTo('stanley/components/image')(AemImage as Component, ImageEditConfig);
MapTo('stanley/components/title')(AemTitle as Component, TitleEditConfig);
MapTo('stanley/components/carousel-widget')(Carousel as Component);
MapTo('stanley/components/weather')(Weather as Component);
MapTo('stanley/components/calendar')(Calendar as Component);
MapTo('stanley/components/navigation')(Navigation as Component);
MapTo('stanley/components/header')(AemHeader as Component, AemHeaderConfig);
